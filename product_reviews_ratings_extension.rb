class ProductReviewsRatingsExtension < Spree::Extension
  version "1.0"
  description "Product Reviews and Ratings"
  url "http://spreehq.org/"

  def activate
    Admin::ConfigurationsController.class_eval do
      before_filter :add_product_reviews_link, :only => :index
      def add_product_reviews_link
        @extension_links << { :link => admin_reviews_url, :link_text => 'Product Reviews', :description => 'Product Reviews' }
      end
    end

    ProductsController.class_eval do
      before_filter :set_user_review_and_rating, :only => :show
      
      def set_user_review_and_rating
        @review_rating_header = ''
        if Spree::ProductReviewsRatings::Config[:can_review_product] == 1
          @product_review = current_user ? Review.find(:first, :conditions => { :product_id => object.id, :user_id => current_user.id }) : Review.new
          @review_rating_header = 'Review'
        end
        if Spree::ProductReviewsRatings::Config[:can_rate_product] == 1
          product_rating = current_user ? Rating.find(:first, :conditions => { :product_id => object.id, :user_id => current_user.id }) : Rating.new
          @user_rating = product_rating ? product_rating.rating : 0
          @review_rating_header = Spree::ProductReviewsRatings::Config[:can_review_product] == 1 ? 'Review and Rate' : 'Rate'
          @reviews = Review.find(:all, :conditions => { :review_status_id => 2, :product_id => object.id }, :limit => Spree::ProductReviewsRatings::Config[:review_count])
          @review_count = Review.find(:all, :conditions => { :review_status_id => 2, :product_id => object.id }).size
        end
        @review_rating_header += ' this Product'
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
