# frozen_string_literal: true

class Query < ApplicationRecord
  belongs_to :query_group
  belongs_to :user
  has_many :results
  
  validates :query_text, presence: true

  def last_result
    results.active.last
  end

  def fetch_fresh_results!
    api_response = query_group.get_results_for(self.query_text)
    if api_response.presence
      result = Result.new({
        data: api_response,
        query_id: self.id,
        query_group_id: self.query_group_id,
        user_id: self.user_id
      })
      result.save!
      result
    end
  end
end
