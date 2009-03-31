class Review < ActiveRecord::Base
  belongs_to :product
  belongs_to :user
  has_one :rating
  validates_presence_of :product_id
  validates_presence_of :user_id
  validates_presence_of :content
end
