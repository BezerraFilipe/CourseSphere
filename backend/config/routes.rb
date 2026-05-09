Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "auth/register", to: "auth#register"
      post "auth/login",    to: "auth#login"
      delete "auth/logout", to: "auth#logout"

      resources :courses do
        resources :lessons, only: [:index, :create, :update, :destroy]
      end
    end
  end
end
