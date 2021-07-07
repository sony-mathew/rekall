# frozen_string_literal: true

class ApiSource < ApplicationRecord
  belongs_to :user

  before_save :set_default_request
  
  validates :name, :host, :environment, presence: true

  private 
  def set_default_request
    self.request = {}
  end
end
