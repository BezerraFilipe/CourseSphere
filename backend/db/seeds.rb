# Create some users
users = ["Lucas", "Filipe", "Barbara"].map do |name|
  User.find_or_create_by(email: "#{name.downcase}@example.com") do |u|
    u.name = name
    u.password = "password123"
  end
end

# To each user, create 2 courses with 3 lessons each
users.each do |user|
  2.times do |i|
    course = Course.find_or_create_by(name: "Course #{i+1} by #{user.name}", creator: user) do |c|
      c.description = "Description for Course #{i+1}"
      c.start_date = Date.today + rand(1..10).days
      c.end_date = c.start_date + rand(5..15).days
    end


    3.times do |j|
      Lesson.find_or_create_by(title: "Lesson #{j+1} for #{course.name}", course: course) do |l|
        l.video_url = "https://example.com/video#{rand(1000)}"
        l.status = ["draft", "published"].sample
      end
    end

  end
end