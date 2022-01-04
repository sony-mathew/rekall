class ChangeScoreToFloatInSnapshots < ActiveRecord::Migration[6.1]
  def change
    change_column :snapshots, :latest_score, :float
  end
end
