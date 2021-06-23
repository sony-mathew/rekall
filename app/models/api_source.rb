# frozen_string_literal: true

class ApiSource < ApplicationRecord
  belongs_to :user
  validates :name, :host, :environment, presence: true


  before_save :set_default_request
  scope :active, -> { where(is_deleted: false) }

  private 
  def set_default_request
    self.request = {}
  end
end
