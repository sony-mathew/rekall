# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  scope :active, -> { where(is_deleted: false) }

  def soft_delete
    self.is_deleted = true
    save
  end

end
