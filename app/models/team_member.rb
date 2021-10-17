# frozen_string_literal: true

class TeamMember < ApplicationRecord
  belongs_to :user
  belongs_to :team
  belongs_to :member, class_name: 'User', foreign_key: 'member_id'

  enum role: {
    admin: 0,
    viewer: 1
  }

end
