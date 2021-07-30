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

  def get_results_for(query_text, page_number = 0)
    options = {
      host: api_source.host,
      headers: api_source.request,
      query_text: query_text,
      query_string: self.query_string,
      body: self.request_body,
      page_size: page_size,
      page_number: page_number
    }
    req = ApiRequestManager.new(options)
    if http_method == 'GET'
      formatted_response(req.do_get)
    elsif http_method == 'POST'
      formatted_response(req.do_post)
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

  def formatted_response(data)
    if transform_response.present?
      begin
        js = JavascriptEvaluator.new({ code: transform_response, params: { data: data }})
        evaluated_result = js.result
        evaluated_result
      rescue Exception => e
        { 
          error: "Something happened while transforming the response",
          transform_response: transform_response,
          data: data,
          details: e.inspect
        }
      end
    else
      data
    end
  end
end
