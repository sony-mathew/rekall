class AddQueriesTable < ActiveRecord::Migration[6.1]
  def change
    create_table :queries do |t|
      t.string      :query_text,        null: false
      t.string      :notes                       
      t.integer     :latest_score
      t.integer     :query_group_id,   null: false
      
      t.uuid     :user_id, null: false
      t.boolean     :is_deleted,    null: false, default: false
      t.timestamps
    end
  end
end
