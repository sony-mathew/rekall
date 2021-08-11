# frozen_string_literal: true

desc "drops the db, creates db, migrates db and populates sample data"
task setup: [:environment, "db:drop", "db:create", "db:migrate"] do
  Rake::Task["reset_and_populate_sample_data"].invoke if Rails.env.development?
end

desc "Populates sample data without resetting the database first"
task populate_sample_data: [:environment] do
  create_sample_data!
  puts "sample data has been added."
end

desc "Populates sample data without after resetting the database"
task reset_and_populate_sample_data: [:environment] do
  if Rails.env.production?
    puts "Skipping deleting and populating sample data"
  elsif Rails.env.staging?
    puts "Skipping deleting and populating sample data"
  else
    delete_all_records_from_all_tables
    Rake::Task["populate_sample_data"].invoke
  end
end

#
# DO NOT CHANGE ANYTHING IN THIS METHOD
# This is last layer of defense against deleting data in production
# If you need to delete data in staging or in production
# please execute the command manually and do not change this method
#
def delete_all_records_from_all_tables
  if Rails.env.production?
    raise "deleting all records in production is not alllowed"
  else
    Rake::Task["db:schema:load"].invoke
  end
end

def create_sample_data!
  create_user! email: "oliver@example.com"
  create_api_source!
  create_scorers!
  create_query_group!
  create_queries!
end

def create_user!(options = {})
  user_attributes = { password: "welcome",
                      first_name: "Oliver",
                      last_name: "Smith",
                      role: "super_admin" }
  attributes = user_attributes.merge options
  User.create! attributes
end

def create_api_source!(options = {})
  api_source_attributes = {
    name: 'NPM JS Search',
    host: 'https://www.npmjs.com',
    environment: 'production',
    request: {},
    user: User.first
  }
  attributes = api_source_attributes.merge options
  ApiSource.create! attributes
end

def create_scorers!
  attributes = {
    name: 'Average Precision (AP)',
    code: "// Average Precision (AP)
      var positionAndValues = docPositionAndValues();
      var largestPosition = Math.max(...Object.keys(positionAndValues));
      var countRelevantDocuments = 0, 
          allDocPrecisions = [],
          relevantDocsPrecisions = [];
      for(var i = 1; i <= largestPosition; ++i) {
          console.log(i, positionAndValues[i])
          if(positionAndValues[i] === 1) {
              countRelevantDocuments += 1
              relevantDocsPrecisions.push(parseFloat(countRelevantDocuments) / i)
          }
          allDocPrecisions.push(parseFloat(countRelevantDocuments) / i);
      }
      var numerator = relevantDocsPrecisions.reduce((a, b) => a + b, 0),
          denominator = Math.max(relevantDocsPrecisions.length, 1);
      averagePrecison = numerator / denominator;
      averagePrecison",
    scale_type: 'binary'
  }
  Scorer.create! attributes
  attributes = {
    name: 'Cumulative Gain (CG)',
    code: "// Cumulative Gain (CG)
    var positionAndValues = docPositionAndValues();
    var allValues = Object.keys(positionAndValues).map((pos) => positionAndValues[pos]);
    var cg = allValues.reduce((a, b) => a + b, 0);
    cg",
    scale_type: 'graded'
  }
  Scorer.create! attributes
  attributes = {
    name: 'Discounted Cumulative Gain (DCG)',
    code: "// Discounted Cumulative Gain (DCG)
    var allDocPositionAndValues = docPositionAndValues();
    
    // first approach - ( relevance / log2(i + 1) )
    // second approach (better penalizing of relevant results appearing lower) - ( (pow2(relevance) - 1) / log2(i + 1) )
    function findDcgFor(positionAndValues) {
        var individualDCGs = [];
        var positions = Object.keys(positionAndValues);
        for(var i = 0; i < positions.length; ++i) {
            var numerator = Math.pow(2, positionAndValues[positions[i]]) - 1;
            individualDCGs.push(parseFloat(numerator) / Math.log2(positions[i] + 1));
        }
        dcg = individualDCGs.reduce((a, b) => a + b, 0);
        return dcg;
    };
    findDcgFor(allDocPositionAndValues)",
    scale_type: 'graded'
  }
  Scorer.create! attributes
  attributes = {
    name: 'Normalized Discounted Cumulative Gain (nDCG)',
    code: "// normalized Discounted Cumulative Gain (nDCG)
    var allDocPositionAndValues = docPositionAndValues();
    
    function findDcgFor(positionAndValues) {
        var individualDCGs = [];
        var positions = Object.keys(positionAndValues);
        for(var i = 0; i < positions.length; ++i) {
            var numerator = Math.pow(2, positionAndValues[positions[i]]) - 1;
            individualDCGs.push(parseFloat(numerator) / Math.log2(positions[i] + 1));
        }
        dcg = individualDCGs.reduce((a, b) => a + b, 0);
        return dcg;
    };
    
    function findNdcgFor(positionAndValues) {
        var allValues = Object.keys(positionAndValues).map((pos) => (positionAndValues[pos]));
        var topValues = allValues.sort((a, b) => (b - a)),
            idealPositionAndValues = {};
    
        var sortedPositions = Object.keys(positionAndValues).sort();
        for(var i = 0; i < sortedPositions.length; i++){
            idealPositionAndValues[sortedPositions[i]] = topValues[i];
        }
        var dcg = findDcgFor(positionAndValues),
            idcg = findDcgFor(idealPositionAndValues);
        var ndcg = (dcg / idcg);
        return ndcg;
    }
    
    findNdcgFor(allDocPositionAndValues)",
    scale_type: 'graded'
  }
  Scorer.create! attributes
end

def create_query_group!(options = {})
  query_group_attributes = {
    name: 'NPM JS Prod Test Query Group',
    api_source_id: ApiSource.first.id,
    scorer_id: Scorer.first.id,
    http_method: 'GET',
    page_size: 10,
    request_body: {},
    query_string: '/search/suggestions?q=<%= query %>',
    transform_response: '',
    document_uuid: 'name',
    document_fields: ['description', 'version'],
    user: User.first
  }
  attributes = query_group_attributes.merge options
  QueryGroup.create! attributes
end

def create_queries!(options = {})
  query_group = QueryGroup.first
  query_texts = ['api', 'search', 'test']
  query_texts.each do |q|
    query_model_attributes = {
      query_text: q,
      notes: "#{q} - #{query_group.name}",
      query_group: query_group,
      user: User.first
    }
    attributes = query_model_attributes.merge options
    Query.create! attributes
  end
end
