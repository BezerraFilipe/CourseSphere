class Course < ApplicationRecord
  belongs_to :creator, class_name: 'User'
  
  validates :name, presence: true, length: { minimum: 3 }
  validates :start_date, presence: true
  validates :end_date, presence: true, comparison: { greater_than_or_equal_to: :start_date, message: "end_date must be greater than or equal to start_date" }


end
