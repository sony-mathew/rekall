# Interface for using this module:
#
# Example code:
#         code = `var userName = name();
#           var helloMessage = `Hello ${userName}`;
#           helloMessage`;
#         params = {
#           name: "Sony"
#         };
#         js = JavascriptEvaluator.new({ code: code, params: params)
#         js.result
# => "Hello Sony"

class JavascriptEvaluator
  attr_accessor :options, :errors

  def initialize(options)
    @options = options
    @js_code = options[:code]
    @params = options[:params]
  end

  def result
    context = MiniRacer::Context.new

    @params.each do |key, value|
      context.attach(key.to_s, proc{ value })
    end

    evaluated_result = context.eval @js_code
    puts "JS Execution Result: ", evaluated_result
    puts "Params: ", @params.inspect
    evaluated_result
  end

end
