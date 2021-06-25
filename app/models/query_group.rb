# frozen_string_literal: true

class QueryGroup < ApplicationRecord
  belongs_to :user
  belongs_to :api_source, class_name: 'ApiSource', foreign_key: 'api_source_id'
  belongs_to :scorer, class_name: 'Scorer', foreign_key: 'scorer_id'

  enum http_method: {
    GET: 0,
    POST: 1,
    PUT: 2
  }

  scope :active, -> { where(is_deleted: false) }

  validates :name, :http_method, :document_fields, presence: true
  validate :valid_page_size

  private 
  def valid_page_size
    self.page_size ||= 10
    if page_size < 0 || page_size >= 50
      errors.add(:page_size, "should be between (0, 50]")
    end
  end
end
