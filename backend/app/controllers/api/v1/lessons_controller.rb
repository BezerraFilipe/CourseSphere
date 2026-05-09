class Api::V1::LessonsController < ApplicationController
  before_action :authenticate_user!
  
end