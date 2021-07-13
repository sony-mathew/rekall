class ChangeTransformColumnToString < ActiveRecord::Migration[6.1]
  def change
    change_column :query_groups, :transform_response, :string
  end
end
