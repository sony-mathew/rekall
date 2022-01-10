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

def create_user!(options = {})
  user_attributes = { password: "welcome",
                      first_name: "Oliver",
                      last_name: "Smith",
                      role: "super_admin" }
  attributes = user_attributes.merge options
  User.create! attributes
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
    
        var sortedPositions = Object.keys(positionAndValues).map(parseFloat).sort((a,b) => a - b);
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

def create_source_seed_data!(options = {})
  # assume the options structure to be:
  #   { 
  #     attributes: {}, 
  #     query_groups: [
  #       { 
  #         attributes: {}, 
  #         queries: [
  #           { 
  #             attributes: {} 
  #           }, 
  #           ...
  #         ],
  #       },
  #       ...

  #     ]
  #   }
  options[:sources].each do |source_options|
    create_api_source!(source_options)
  end
end

def create_api_source!(options = {})
  api_source_attributes = {
    request: {},
    user: User.first
  }
  puts options[:attributes].inspect
  attributes = api_source_attributes.merge options[:attributes]
  source = ApiSource.create(attributes)

  if options[:query_groups].presence
    options[:query_groups].each { |query_group_options| create_query_group!(source, query_group_options) }
  end
end

def create_query_group!(source, options)
  query_group_attributes = {
    api_source_id: source.id,
    scorer_id: Scorer.first.id,
    page_size: 10,
    request_body: {},
    user: User.first
  }
  attributes = query_group_attributes.merge options[:attributes]
  query_group = QueryGroup.create(attributes)
  
  if options[:queries].presence
    options[:queries].each { |query_options| create_query!(source, query_group, query_options) }
  end  
end

def create_query!(source, query_group, options)
  query_model_attributes = {
    query_group: query_group,
    user: User.first
  }
  attributes = query_model_attributes.merge options[:attributes]
  Query.create! attributes
end

SEED_DATA_FOR_SOURCES = {
  sources: [
    {
      attributes: {
        name: 'NPM JS Search',
        host: 'https://www.npmjs.com',
        environment: 'production',
        request: {}
      },
      query_groups: [
        {
          attributes: {
            name: 'NPM JS Prod Test Query Group',
            http_method: 'GET',
            page_size: 10,
            request_body: {},
            query_string: '/search/suggestions?q={{ query }}',
            transform_response: "var rawData = data();
              rawData.map((doc) => Object.assign(doc, { packageLink: doc.links.npm }) )",
            document_uuid: 'name',
            document_fields: ['name', 'description', 'packageLink', 'version']
          },
          queries: [
            {
              attributes: { query_text: 'api'}
            },
            {
              attributes: { query_text: 'test'}
            }
          ]
        }
      ]
    },
    {
      attributes: {
        name: 'Elastic Search (local)',
        host: 'http://localhost:9200/',
        environment: 'development',
        request: {}
      },
      query_groups: [
        {
          attributes: {
            name: 'ES Query Group - Seed',
            http_method: 'POST',
            page_size: 10,
            request_body: {
              "query": {
                "query_string": {
                  "query": "{{ query }}"
                }
              },
              "size": 10,
              "from": 0,
              "sort": []
            },
            query_string: '_search',
            transform_response: "var rawData = data();
              rawData['hits']['hits'].map((doc) => Object.assign(doc, doc['_source']))",
            document_uuid: '_id',
            document_fields: ['author_name', 'message', '_type']
          },
          queries: [
            {
              attributes: { query_text: '*'}
            },
            {
              attributes: { query_text: 'test'}
            }
          ]
        }
      ]
    }
  ]
}

def create_sample_data!
  create_user! email: "oliver@example.com"
  create_scorers!

  create_source_seed_data!(SEED_DATA_FOR_SOURCES)
end
