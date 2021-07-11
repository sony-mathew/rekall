class AddQueryResultsTable < ActiveRecord::Migration[6.1]
  def change
    add_column :query_groups, :document_uuid, :string

    create_table :results do |t|
      t.string      :notes
      t.json        :data, null: false                       
      t.integer     :latest_score
      t.integer     :query_id, null: false
      t.integer     :query_group_id, null: false
      
      t.uuid        :user_id, null: false
      t.boolean     :is_snapshoted, null: false, default: false
      t.boolean     :is_deleted, null: false, default: false
      t.timestamps
    end

    create_table :scores do |t|
      t.integer     :value
      t.string      :document_uuid
      t.integer     :scorer_id, null: false
      t.integer     :result_id, null: false
      t.integer     :snapshot_id
      t.integer     :query_id, null: false
      t.integer     :query_group_id, null: false
      
      t.uuid        :user_id, null: false
      t.boolean     :is_deleted, null: false, default: false
      t.timestamps
    end

    create_table :snapshots do |t|
      t.string      :name
      t.string      :notes
      t.json        :data, null: false                       
      t.integer     :latest_score
      t.integer     :result_id, null: false
      t.integer     :query_id, null: false
      t.integer     :query_group_id, null: false
      
      t.uuid        :user_id, null: false
      t.boolean     :is_deleted,    null: false, default: false
      t.timestamps
    end
  end
end
