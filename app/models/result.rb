# frozen_string_literal: true

class Result < ApplicationRecord
  belongs_to :query
  belongs_to :query_group
  belongs_to :user
  has_many :scores

  def has_document?(document_uuid)
    self.data.select { |doc| doc[query_group.document_uuid] == document_uuid }
  end

  def register_score!(value, document_uuid)
    score = Score.new({
      value: value,
      document_uuid: document_uuid,
      scorer_id: self.query_group.scorer_id,
      result_id: self.id,
      query_id: self.query_id,
      query_group_id: self.query_group_id,
      user_id: self.user_id
    })
    score.save!
    score
  end
end
