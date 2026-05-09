class User < ApplicationRecord
  has_secure_password

  has_many :created_courses, class_name: 'Course', foreign_key: 'creator_id', dependent: :destroy

  validates :name,  presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP, message: "must be a valid email address" }
  validates :auth_token, uniqueness: true, allow_nil: true

  before_create :generate_auth_token

  def regenerate_auth_token
    update!(auth_token: SecureRandom.hex(20))
  end

  private

  def generate_auth_token
    self.auth_token = SecureRandom.hex(20)
  end
end