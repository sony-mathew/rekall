# frozen_string_literal: true

class TeamMember < ApplicationRecord
  belongs_to :user
  belongs_to :team
  belongs_to :member, class_name: 'User', foreign_key: 'member_id'

  enum role: {
    admin: 0,
    viewer: 1
  }

  validate :resource_uniqueness

  private

  def resource_uniqueness
    if !is_deleted
      team_member = team.member_associations.active.find_by(member: member)
      if team_member
        errors.add(:member_id, "(user) is already part of the team")
      end
    end
  end

end
