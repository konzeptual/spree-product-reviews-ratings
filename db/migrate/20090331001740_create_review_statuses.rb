class CreateReviewStatuses < ActiveRecord::Migration
  def self.up
    create_table :review_statuses do |t|
      t.string :status

      t.timestamps
    end
  end

  def self.down
    drop_table :review_statuses
  end
end
