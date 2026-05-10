class Api::V1::CoursesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_course, only: [:show, :update, :destroy]

  # GET /api/v1/courses returns all courses (with creator information) or only those created by the current user if ?mine=true is passed
  def index
    courses = params[:mine] == "true" ? current_user.created_courses : Course.all
    courses = courses.includes(:creator)
    # Filter by name if search param is present (case-insensitive)
    courses = courses.where("name ILIKE ?", "%#{params[:search]}%") if params[:search].present?
    render json: courses.map { |c| course_json(c) }
  end

  def show
    render json: { course: course_json(@course), lessons: @course.lessons }
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

  def course_json(course)
    course.as_json.merge(
      creator_name: course.creator.name,
      creator_initial: course.creator.name[0].upcase
    )
  end
end