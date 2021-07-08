# frozen_string_literal: true

class Query < ApplicationRecord
  belongs_to :query_group
  belongs_to :user
  
  validates :query_text, presence: true

  def get_results
    query_group.get_results_for(self.query_text)
  end
end
