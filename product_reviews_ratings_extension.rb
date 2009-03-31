# Uncomment this if you reference any of your controllers in activate
# require_dependency 'application'

class ProductReviewsRatingsExtension < Spree::Extension
  version "1.0"
  description "Product Reviews and Ratings"
  url "http://spreehq.org/"

  def activate
    ProductsController.class_eval do
      before_filter :set_user_rating, :only => :show
      def set_user_rating
        if current_user
          product_rating = Rating.find(:first, :conditions => { :product_id => object.id, :user_id => current_user.id })
          @user_rating = product_rating.rating if product_rating
        end
        @user_rating ||= 0
      end
    end

    Product.class_eval do
      has_many :ratings
      has_many :reviews
    end

    User.class_eval do
      has_many :ratings
      has_many :reviews
    end
  end
end
