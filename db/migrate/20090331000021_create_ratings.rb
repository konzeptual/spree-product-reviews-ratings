class CreateRatings < ActiveRecord::Migration
  def self.up
    create_table :ratings do |t|
      t.integer :rating
      t.integer :product_id
      t.integer :user_id
      t.integer :review_id

      t.timestamps
    end
  end

  def self.down
    drop_table :ratings
  end
end
