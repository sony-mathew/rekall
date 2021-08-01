# frozen_string_literal: true

class Team < ApplicationRecord
  belongs_to :user
  has_many :resources, class_name: 'TeamResource'
  has_many :members, class_name: 'TeamMember'

  validates :name, presence: true
  validates :name, uniqueness: true
end
