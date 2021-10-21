# frozen_string_literal: true

class ApiSource < ApplicationRecord
  belongs_to :user
  has_many :team_resource_associations, class_name: 'TeamResource', as: 'resourceable'

  before_save :set_default_request
  
  validates :name, :host, :environment, presence: true

  private 
  def set_default_request
    self.request = {}
  end
end
