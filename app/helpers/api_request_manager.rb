class ApiRequestManager
  attr_accessor :res, :options, :errors

  def initialize(options)
    @options = options
  end

  def do_post
    log_req 'POST'
    # @res = RestClient.post(formatted_uri, formatted_request_body.to_json, custom_headers.merge({ content_type: :json }))
    puts "#*"*100
    puts formatted_request_body.to_json
    
    @res = RestClient::Request.execute(method: :post,
      url: formatted_uri,
      payload: formatted_request_body.to_json,
      headers: custom_headers.merge({ content_type: :json }),
      verify_ssl: false
    )
    JSON.parse(@res.body)
  rescue RestClient::ExceptionWithResponse => e
    puts e.inspect
    @errors = e.response
    e.response
  end

  def do_get
    log_req 'GET'
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

  def log_req req_method
    puts '#'*50
    puts "[#{req_method}] #{formatted_uri}"
  end

  def formatted_uri
    if !(@options[:host][-1] == '/' || @options[:query_string][0] == '/')
      @options[:host] = "#{@options[:host]}/"
    end
    template_transform("#{@options[:host]}#{@options[:query_string]}")
  end

  def template_transform(str)
    template = Liquid::Template.parse(str)
    template.render('query' => @options[:query_text], 'page_size' => @options[:page_size], 'page_number' => @options[:page_number])
  end

  def formatted_request_body
    template = Liquid::Template.parse(JSON.generate(@options[:body]))
    rendered_template = template.render('query' => @options[:query_text], 'page_size' => @options[:page_size], 'page_number' => @options[:page_number])
    JSON.parse(rendered_template)
  end
end
