class Api::V1::LessonsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_course
  before_action :set_lesson, only: [:update, :destroy]

  def index
    lessons = params[:status].present? ? @course.lessons.where(status: params[:status]) : @course.lessons
    render json: lessons, status: :ok
  end

  def create
    
    if @course.creator != current_user
      render json: { error: "Forbidden" }, status: :forbidden
      return
    end

    lesson = @course.lessons.new(lesson_params)

    if lesson.save
      render json: lesson, status: :created
    else
      render json: { errors: lesson.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @course.creator != current_user
      render json: { error: "Forbidden" }, status: :forbidden
      return
    end

    if @lesson.update(lesson_params)
      render json: @lesson, status: :ok
    else
      render json: { errors: @lesson.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    if @course.creator != current_user
      render json: { error: "Forbidden" }, status: :forbidden
      return
    end

    @lesson.destroy
    render json: { message: "Lesson deleted successfully" }, status: :ok
  end

  private

  def set_course
    @course = Course.find(params[:course_id])
  end

  def set_lesson
    @lesson = @course.lessons.find(params[:id])
  end

  def lesson_params
    params.permit(:title, :status, :video_url)
  end
end