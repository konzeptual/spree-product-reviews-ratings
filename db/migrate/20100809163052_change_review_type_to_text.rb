class ChangeReviewTypeToText < ActiveRecord::Migration
  def self.up
    change_column :reviews, :content, :text
  end

  def self.down
    change_column :reviews, :content, :string 
  end
end
