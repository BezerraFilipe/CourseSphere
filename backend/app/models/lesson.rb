class Lesson < ApplicationRecord
  belongs_to :course

  validates :title, presence: true, length: { minimum: 3 }
  enum :status, { draft: "draft", published: "published" }, default: :draft

  validate :video_url_format, if: -> { video_url.present? }

  private 
  
  def video_url_format
    uri = URI.parse(video_url)
    unless uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)
      errors.add(:video_url, "must be a valid URL")
    end
    rescue URI::InvalidURIError
      errors.add(:video_url, "must be a valid URL")
  end

end
