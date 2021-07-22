# frozen_string_literal: true

class Result < ApplicationRecord
  belongs_to :query
  belongs_to :query_group
  belongs_to :user
  has_many :scores

  def has_document?(document)
    document_uuid = document[query_group.document_uuid]
    self.data.select { |doc| doc[query_group.document_uuid] == document_uuid }
  end

  def active_scores
    scores.last
  end

  def ratings
    active_scores.ratings
  end

  def recalculate_final_score!
    self.latest_score = query_group.scorer.calculate_score_for(query_group.document_uuid, ratings, self.data)
    self.save!
    self.latest_score
  end

  def register_score!(params)
    score = Score.find_or_initialize_by({
      document_uuid: query_group.document_uuid,
      scorer_id: query_group.scorer_id,
      result_id: id,
      query_id: query_id,
      query_group_id: query_group_id,
      user_id: user_id
    });
    score.update_ratings_with(params)
    score.save!
    recalculate_final_score!
    score
  end
end
