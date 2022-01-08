# Interface for using this module:
#
# Example code:
#     code = "var userObj = user();
#         userObj.address = 'Kerala';
#         userObj";
#     params = {
#         user: { name: 'John Doe', age: 20 }
#     };
#     js = JavascriptEvaluator.new({ code: code, params: params })
#     js.result
#
# => {"name"=>"John Doe", "age"=>20, "address"=>"Kerala"}

class JavascriptEvaluator
  attr_accessor :options, :errors

  def initialize(options)
    @options = options
    @js_code = options[:code]
    @params = options[:params]
  end

  def result
    # setting some basic limits
    # timeout as 60 seconds, max_memory as 50 mb
    context = MiniRacer::Context.new(timeout: 60_0000, max_memory: 50_000_000)
    

    @params.each do |key, value|
      context.attach(key.to_s, proc{ value })
    end

    evaluated_result = context.eval @js_code
    puts "JS Execution Result: ", evaluated_result
    puts "Params: ", @params.inspect
    evaluated_result
  end

end
