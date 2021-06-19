class AddApiSources < ActiveRecord::Migration[6.1]
  def change

    create_table :api_sources do |t|
      t.string      :name,          null: false
      t.string      :host,          null: false
      t.string      :environment,   null: false
      t.json        :request,       null: false
      t.references  :user,          type: :uuid
      t.boolean     :is_deleted,    null: false, default: false

      t.timestamps
    end
  end
end
