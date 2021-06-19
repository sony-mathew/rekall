# frozen_string_literal: true

class ApiSource < ApplicationRecord
  belongs_to :user
  validates :name, :host, :environment, presence: true

  scope :active, -> { where(is_deleted: false) }

end
