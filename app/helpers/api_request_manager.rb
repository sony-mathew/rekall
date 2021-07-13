class ApiRequestManager
  attr_accessor :res, :options, :errors

  def initialize(options)
    @options = options
  end

  def do_post
    log_req
    @res = RestClient.post(formatted_uri, formatted_request_body.to_json, custom_headers.merge({ content_type: :json }))
    JSON.parse(@res.body)
  rescue RestClient::ExceptionWithResponse => e
    @errors = e.response
    e.response
  end

  def do_get
    log_req
    @res = RestClient.get(formatted_uri, custom_headers)
    JSON.parse(@res.body)
  rescue RestClient::ExceptionWithResponse => e
    @errors = e.response
    e.response
  end


  private
  def custom_headers
    {
      accept: :json
    }
  end

  def log_req
    puts '#'*50
    puts "Sending request to #{formatted_uri}"
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
    template = ERB.new(JSON.generate(@options[:body]))
    res = template.result_with_hash(query: @options[:query_text])
    JSON.parse(res)
  end
end
