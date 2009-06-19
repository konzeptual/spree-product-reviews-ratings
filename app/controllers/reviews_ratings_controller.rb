class ReviewsRatingsController < ApplicationController
  resource_controller

  def create
    logger.debug "steph #{params.inspect}"
    msg = ''
    if params[reviews]
      #if textarea is blank, just submit rating (if review save is successful then save rating to it)
      #Change to find by user and product id or create
      #Review.delete(Review.find(:first, :conditions => { :product_id => params[:review][:product_id], :user_id => params[:review][:user_id]} ))
      #review = update_params
      msg += 'Your review has been submitted '
      msg += ' and added to our queue. ' if true #status == 2
    if
    if params[rating]
      #Change to find by user and product id or create
      #Rating.delete(Rating.find(:first, :conditions => { :product_id => params[:rating][:product_id], :user_id => params[:rating][:user_id]} ))
      #rating = update_params
      msg += 'Your rating has been saved.'
    end
    respond_to do |format|
      format.js {
        render :json => { :status => 2, \
                          :review_id => review.id, \
                          :review_title => review.title, \
                          :review_content => review.content, \
                          :average_rating_count => rating.product.ratings.size, \
                          :average_rating => rating.product.ratings.average('rating').to_i, \
                          :msg => msg, \
                          :success => 1 }.to_json, \
               :layout => false 
      }
    end
  end
  
  destroy.response do |wants|
    wants.html { render :json => { :success => 1 }.to_json, :layout => false }
  end

  def index
    @product = Product.find_by_permalink!(params[:product_id])
    @reviews = []
    @product.reviews.each { |review| @reviews << review if review.review_status.status == 'accepted' }
  end
end
