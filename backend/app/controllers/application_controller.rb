class ApplicationController < ActionController::API
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
end