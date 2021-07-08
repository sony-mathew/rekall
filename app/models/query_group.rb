# frozen_string_literal: true

class QueryGroup < ApplicationRecord
  belongs_to :user
  belongs_to :api_source, class_name: 'ApiSource', foreign_key: 'api_source_id'
  belongs_to :scorer, class_name: 'Scorer', foreign_key: 'scorer_id'
  has_many :queries

  enum http_method: {
    GET: 0,
    POST: 1,
    PUT: 2
  }

  validates :name, :http_method, :document_fields, presence: true
  validate :valid_page_size

  def get_results_for(query_text)
    options = {
      host: api_source.host,
      headers: api_source.request,
      query_text: query_text,
      query_string: self.query_string,
      body: self.request_body
    }
    req = ApiRequestManager.new(options)
    if http_method == 'GET'
      req.do_get
    elsif http_method == 'POST'
      req.do_post
    else
      []
    end
  end

  private 
  def valid_page_size
    self.page_size ||= 10
    if page_size < 0 || page_size >= 50
      errors.add(:page_size, "should be between (0, 50]")
    end
  end
end
