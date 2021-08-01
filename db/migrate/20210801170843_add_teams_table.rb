class AddTeamsTable < ActiveRecord::Migration[6.1]
  def change
    create_table :team do |t|
      t.string      :name, null: false
      t.string      :description
      
      t.uuid        :user_id, null: false
      t.boolean     :is_deleted, null: false, default: false
      t.timestamps
    end

    create_table :team_members do |t|
      t.uuid        :member_id, null: false
      t.integer     :role,    null: false, default: 0
      
      t.bigint      :team_id
      t.uuid        :user_id, null: false
      t.boolean     :is_deleted, null: false, default: false
      t.timestamps
    end

    create_table :team_resources do |t|
      t.bigint  :resourceable_id
      t.string  :resourceable_type
      
      t.bigint      :team_id
      t.uuid        :user_id, null: false
      t.boolean     :is_deleted, null: false, default: false
      t.timestamps
    end

    add_index :team_resources, [:resourceable_type, :resourceable_id]
  end
end
