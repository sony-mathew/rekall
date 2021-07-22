# frozen_string_literal: true

class Score < ApplicationRecord
  belongs_to :result
  belongs_to :query
  belongs_to :query_group
  belongs_to :user

  def update_ratings_with(params)
    doc_score = valid_scorer_scale_value(params[:score])
    return false unless doc_score

    doc = params[:doc]
    document_uuid = doc[query_group.document_uuid]
    doc_pos = find_doc_position(document_uuid)
    self.ratings ||= {}
    self.ratings[document_uuid] = { pos: doc_pos, value: doc_score }
  end

  private
  def valid_scorer_scale_value(value)
    if !query_group.scorer.is_valid_scale_value?(value)
      errors.add(:ratings, "score should be in #{query_group.scorer.scale.inspect}")
      return false
    end
    value
  end

  def find_doc_position(document_uuid)
    result.data.each_with_index do |doc, index|
      return index + 1 if doc[query_group.document_uuid] == document_uuid
    end
    -1
  end
end
