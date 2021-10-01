# frozen_string_literal: true

class Team < ApplicationRecord
  belongs_to :user
  has_many :resources, class_name: 'TeamResource'
  has_many :member_associations, class_name: 'TeamMember', foreign_key: 'team_id'
  has_many :members, through: :member_associations

  validates :name, presence: true
  validates :name, uniqueness: true
end
