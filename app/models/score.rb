# frozen_string_literal: true

class Score < ApplicationRecord
  belongs_to :query
  belongs_to :query_group
  belongs_to :user

  validate :valid_scorer_scale_value

  private 
  def valid_scorer_scale_value
    if !query_group.scorer.is_valid_scale_value?(self.value)
      errors.add(:value, "should be in #{query_group.scorer.scale.inspect}")
    end
  end
end
