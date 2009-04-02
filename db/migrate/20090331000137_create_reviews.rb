class CreateReviews < ActiveRecord::Migration
  def self.up
    create_table :reviews do |t|
      t.integer :product_id
      t.integer :user_id
      t.string :title
      t.string :content
      t.integer :review_status_id

      t.timestamps
    end
  end

  def self.down
    drop_table :reviews
  end
end
