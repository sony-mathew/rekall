require "http"

class ApiRequestManager
  attr_accessor :res, :options

  def initialize(options)
    @options = options
  end

  def do_post
    @res = HTTP.headers(custom_headers).post(formatted_uri, formatted_request_body)
    @res.parse
  end

  def do_get
    puts '#'*50
    puts "Sending request to #{formatted_uri}"
    @res = HTTP.headers(custom_headers).get(formatted_uri)
    @res.parse
  end


  private
  def custom_headers
    {}
  end

  def formatted_uri
    if !(@options[:host][-1] == '/' || @options[:query_string][0] == '/')
      @options[:host] = "#{@options[:host]}/"
    end
    template_transform("#{@options[:host]}#{@options[:query_string]}")
  end

  def template_transform(str)
    template = ERB.new(str)
    template.result_with_hash(query: @options[:query_text])
  end

  def formatted_request_body
    template = ERB.new(@options[:body].to_json)
    res = template.result_with_hash(query: @options[:query_text])
    JSON.parse(res)
  end
end
