class Rating < ActiveRecord::Base
  belongs_to :user
  belongs_to :product
  belongs_to :review
  validates_presence_of :rating
  validates_presence_of :product_id
  validates_presence_of :user_id
end
