# frozen_string_literal: true

class TeamResource < ApplicationRecord
  belongs_to :user
  belongs_to :team
  belongs_to :resourceable, polymorphic: true
end
