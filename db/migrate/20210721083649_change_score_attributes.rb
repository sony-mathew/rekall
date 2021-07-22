class ChangeScoreAttributes < ActiveRecord::Migration[6.1]
  def change
    remove_column :scores, :value
    add_column :scores, :ratings, :json
  end
end
