# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def soft_delete
    self.is_deleted = true
    save
  end

end
