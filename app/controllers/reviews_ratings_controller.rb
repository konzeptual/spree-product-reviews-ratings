class ReviewsRatingsController < Spree::BaseController
  def create
    msg = ''
		status = Spree::ProductReviewsRatings::Config[:default_review_status]
		review = rating = nil
    if !params[:title].empty? && !params[:content].empty?
			review = Review.find_or_create_by_product_id_and_user_id(:product_id => params[:product_id], :user_id => params[:user_id])
			review.title = params[:title]; review.content = params[:content]; review.review_status_id = status; review.save
			msg += 'Your review has been submitted' + (status == 1 ? ' and added to our queue.' : '.')
    end
    if params[:rating]
			rating = Rating.find_or_create_by_product_id_and_user_id(:product_id => params[:product_id], :user_id => params[:user_id])
		  rating.rating = params[:rating]; rating.review = review if review; rating.save
      msg += 'Your rating has been saved.'
    end
		average = Product.find(params[:product_id]).ratings.average('rating').to_i
    respond_to do |format|
      format.js {
        render :json => { :status => status.to_i, \
                          :review_id => review ? review.id : 0, \
													:display_review => review && status == 2 ? true : false, \
                          :average_rating_count => rating ? rating.product.ratings.size : 1, \
                          :average_rating => rating ? rating.product.ratings.average('rating').to_i : 0, \
                          :msg => msg }.to_json, \
               :layout => false 
      }
    end
  end
 
  def destroy
	  rating = Rating.find_by_review_id(params[:id])
		rating.review_id = nil
		rating.save
	  Review.delete(params[:id])
		respond_to do |format|
		  format.js {
				render :json => { :success => 1 }.to_json, :layout => false
		  }
		end
	end

  def index
    @product = Product.find_by_permalink!(params[:id])
    @reviews = []
    @product.reviews.each { |review| @reviews << review if review.review_status.status == 'accepted' }
  end
end
