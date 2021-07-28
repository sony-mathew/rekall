# frozen_string_literal: true

class Scorer < ApplicationRecord
  enum scale_type: {
    binary: 0,
    graded: 1,
    detailed: 2,
    custom: 3
  }

  DEFAULT_SCALES = {
    binary: [0, 1],
    graded: [0, 1, 2, 3],
    detailed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  }

  scope :common, -> { where(user_id: nil) }
  
  validates :name, :code, :scale_type, presence: true
  validate :valid_scale

  def is_valid_scale_value?(value)
    scale.include?(value)
  end

  # References: 
  # 1. https://machinelearningmedium.com/2017/07/24/discounted-cumulative-gain/
  # 2. https://towardsdatascience.com/evaluate-your-recommendation-engine-using-ndcg-759a851452d1
  def calculate_score_for(document_uuid, ratings, docs)
    @document_uuid = document_uuid
    @ratings = ratings.with_indifferent_access
    @docs = docs

    # Struct ratings: { [document_uuid]: { pos: 1, value: 1 }}
    # find best way to process this
    # { [pos]: [value] }
    pos_value_map = process_ratings_and_docs

    js = JavascriptEvaluator.new({ code: self.code, params: { docPositionAndValues: pos_value_map }})
    res = js.result
    res.to_s.to_f
  end

  private

  def valid_scale
    if DEFAULT_SCALES.keys.include?(scale_type.to_sym)
      self.scale = DEFAULT_SCALES[scale_type.to_sym]
    elsif !scale.presence
      errors.add(:scale, "can't be empty")
    end
  end

  def process_ratings_and_docs
    pos_map = {}
    @ratings.each do |doc_uuid, pos_and_value|
      current_doc_position = find_doc_position(doc_uuid)
      pos_map[current_doc_position] = pos_and_value[:value]
    end
    pos_map
  end

  def find_doc_position(doc_uuid)
    pos = -1
    @docs.each_with_index do |doc, index|
      if doc[@document_uuid] == doc_uuid
        pos = index + 1
        break
      end
    end
    pos
  end

end
