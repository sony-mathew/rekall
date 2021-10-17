# frozen_string_literal: true

class TeamResource < ApplicationRecord
  belongs_to :user
  belongs_to :team
  belongs_to :resourceable, polymorphic: true

  validate :resource_uniqueness

  private

  def resource_uniqueness
    if !is_deleted
      team_resource = team.resource_associations.active.find_by(resourceable: resourceable)
      if team_resource
        errors.add(:resourceable_id, "(#{resourceable_type}) is already part of the team")
      end
    end
  end
end
