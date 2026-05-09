module Api
  module V1
    class AuthController < ApplicationController
      def register
        user = User.new( name: params[:name], email: params[:email], password: params[:password] )

        if user.save
          render json: { token: user.auth_token, user: { id: user.id, name: user.name, email: user.email } }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: params[:email])

        if user && user.authenticate(params[:password])
          user.regenerate_auth_token
          render json: { token: user.auth_token, user: { id: user.id, name: user.name, email: user.email } }, status: :ok
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def logout
        render json: { message: "Logged out successfully" }, status: :ok
      end
    end
  end
end