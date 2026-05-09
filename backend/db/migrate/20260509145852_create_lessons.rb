class CreateLessons < ActiveRecord::Migration[8.1]
  def change
    create_table :lessons do |t|
      t.string      :title,       null: false
      t.string      :video_url
      t.string      :status,      null: false, default: "draft"
      t.references  :course,      null: false, foreign_key: true

      t.timestamps
    end
  end
end
