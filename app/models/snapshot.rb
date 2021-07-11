# frozen_string_literal: true

class Snapshot < ApplicationRecord
  belongs_to :result
  belongs_to :query
  belongs_to :query_group
  belongs_to :user
end
