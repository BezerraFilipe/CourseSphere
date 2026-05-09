class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  private

  def current_user
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    User.find_by(auth_token: token) if token
  end

  def authenticate_user!
    unless current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def record_not_found
    render json: { error: "Record not found" }, status: :not_found
  end
end