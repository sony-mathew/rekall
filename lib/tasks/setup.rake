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
    name: 'The Source',
    host: 'http://localhost:9200',
    environment: 'development',
    request: {},
    user: User.first
  }
  attributes = api_source_attributes.merge options
  ApiSource.create! attributes
end

def create_scorers!
  attributes = {
    name: 'Hello Scorer',
    code: '<>',
    scale_type: 'binary'
  }
  Scorer.create! attributes
end

def create_query_group!(options = {})
  query_group_attributes = {
    name: 'My Query Group',
    api_source_id: ApiSource.first.id,
    scorer_id: Scorer.first.id,
    http_method: 'GET',
    page_size: 10,
    request_body: {},
    query_string: '?q=${query}',
    transform_response: {},
    document_fields: ['id', 'title'],
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
