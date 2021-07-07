class AddQueryGroupsAndScorers < ActiveRecord::Migration[6.1]
  def change

    create_table :scorers do |t|
      t.string      :name,          null: false
      t.string      :code,          null: false
      t.integer     :scale_type,    null: false, default: 0
      t.json        :scale,         null: false

      t.uuid        :user_id
      t.boolean     :is_deleted,    null: false, default: false
      t.timestamps
    end

    create_table :query_groups do |t|
      t.string      :name,                  null: false
      t.integer     :api_source_id,         null: false
      t.integer     :scorer_id,             null: false
      t.integer     :http_method,           null: false, default: 0
      t.integer     :page_size,             null: false
      t.json        :request_body
      t.string      :query_string
      t.json        :transform_response
      t.json        :document_fields,       null: false
      
      t.references  :user,          type: :uuid
      t.boolean     :is_deleted,    null: false, default: false
      t.timestamps
    end
  end
end
