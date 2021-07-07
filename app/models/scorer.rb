# frozen_string_literal: true

class Scorer < ApplicationRecord
  enum scale_type: {
    binary: 0,
    graded: 1,
    detailed: 2,
    custom: 3
  }

  DEFAULT_SCALES = {
    binary: [0, 1],
    graded: [0, 1, 2, 3],
    detailed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  }

  scope :common, -> { where(user_id: nil) }
  
  validates :name, :code, :scale_type, presence: true
  validate :valid_scale

  private

  def valid_scale
    if DEFAULT_SCALES.keys.include?(scale_type.to_sym)
      self.scale = DEFAULT_SCALES[scale_type.to_sym]
    elsif !scale.presence
      errors.add(:scale, "can't be empty")
    end
  end

end
