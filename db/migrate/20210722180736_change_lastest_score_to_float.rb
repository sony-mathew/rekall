class ChangeLastestScoreToFloat < ActiveRecord::Migration[6.1]
  def change
    change_column :queries, :latest_score, :float
    change_column :results, :latest_score, :float
  end
end
