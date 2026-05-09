class Api::V1::CoursesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_course, only: [:show, :update, :destroy]

  def index
  courses = params[:mine] == "true" ? current_user.created_courses : Course.all
  render json: courses, status: :ok
  end

  def show
    render json: { course: @course, lessons: @course.lessons }, status: :ok
  end

  def create
    course = current_user.created_courses.new(course_params)

    if course.save
      render json: course, status: :created
    else
      render json: { errors: course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @course.creator != current_user
      render json: { error: "Forbidden" }, status: :forbidden
      return
    end

    if @course.update(course_params)
      render json: @course, status: :ok
    else
      render json: { errors: @course.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @course.creator != current_user
      render json: { error: "Forbidden" }, status: :forbidden
      return
    end

    @course.destroy
    render json: { message: "Course deleted successfully" }, status: :ok
  end

  private

  def set_course
    @course = Course.find(params[:id])
  end

  def course_params
    params.permit(:name, :description, :start_date, :end_date)
  end
end