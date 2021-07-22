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

  def calculate_score_for(document_uuid, ratings, docs)
    @document_uuid = document_uuid
    @ratings = ratings.with_indifferent_access
    @docs = docs

    # puts "Document UUID: ", document_uuid
    # puts "Ratings: ", ratings.inspect
    # ratings: { [doc_uuid]: { pos: 1, value: 1 }}
    
    # find best way to process this
    # { [pos]: [value, doc_uuid ] }
    pos_value_map = process_ratings_and_docs
    # puts "Pos Value Map:", pos_value_map.inspect
    send("calculate_#{scale_type}_score_for", pos_value_map)
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

  def calculate_binary_score_for(pos_value_map)
    # { [position]: [value] }
    max_pos = pos_value_map.keys.max
    relevant_documents = 0
    
    all_precisions = []
    relevant_doc_precisions = []
    1.step(max_pos).each do |i|
      if pos_value_map[i] == 1
        relevant_documents += 1
        relevant_doc_precisions << (relevant_documents.to_f / i)
      end
      all_precisions << (relevant_documents.to_f / i)
    end
    puts "#"*100
    puts "Precisions : ", all_precisions.inspect
    puts "Relevant Precisions : ", relevant_doc_precisions.inspect
    avg_precision = relevant_doc_precisions.sum.to_f / ([relevant_doc_precisions.size, 1].max)
    puts "Average Precision : ", avg_precision
    avg_precision
  end

  def calculate_graded_score_for(pos_value_map)
  end

  def calculate_detailed_score_for(pos_value_map)
  end

  def calculate_custom_score_for(pos_value_map)
  end

end
