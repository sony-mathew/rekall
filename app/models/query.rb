# frozen_string_literal: true

class Query < ApplicationRecord
  belongs_to :query_group
  belongs_to :user
  has_many :results
  
  validates :query_text, presence: true

  def active_result
    results.active.last
  end

  def fetch_fresh_results!
    api_response = fetch_api_results
    if api_response.presence
      result = Result.find_or_initialize_by({
        query_id: self.id,
        query_group_id: self.query_group_id
      });
      result.data = api_response
      result.user_id ||= self.user_id
      result.save!
      result
    end
  end

  def fetch_api_results
    query_group.get_results_for(self.query_text)
  end

  def refresh_score!
    self.latest_score = active_result.latest_score
    self.save!
    self.latest_score
  end
end
