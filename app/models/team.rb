# frozen_string_literal: true

class Team < ApplicationRecord
  belongs_to :user
  has_many :member_associations, class_name: 'TeamMember', foreign_key: 'team_id'
  has_many :members, through: :member_associations
  has_many :resource_associations, class_name: 'TeamResource', foreign_key: 'team_id'

  validates :name, presence: true
  validates :name, uniqueness: true

  def resources
    resource_associations.collect { |r| r.resourceable }
  end
end
