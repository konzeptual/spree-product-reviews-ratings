class ProductReviewsRatingsExtension < Spree::Extension
  version "1.0"
  description "Product Reviews and Ratings"
  url "http://spreehq.org/"

  def activate
    Admin::ConfigurationsController.class_eval do
      before_filter :add_product_reviews_link, :only => :index
      def add_product_reviews_link
        @extension_links << {:link => admin_reviews_url, :link_text => 'Product Reviews', :description => 'Product Reviews'}
      end
    end

    ProductsController.class_eval do
      before_filter :set_user_review_and_rating, :only => :show
      
      def set_user_review_and_rating
        if current_user
          product_rating = Rating.find(:first, :conditions => { :product_id => object.id, :user_id => current_user.id })
          @user_rating = product_rating.rating if product_rating
          @product_review = Review.find(:first, :conditions => { :product_id => object.id, :user_id => current_user.id })
          @user_title = @product_review.title if @product_review
          @user_review = @product_review.content if @product_review
        end
        @user_rating ||= 0
        @user_title ||= ''
        @user_review ||= ''
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
