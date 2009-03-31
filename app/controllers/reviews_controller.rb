class ReviewsController < Spree::BaseController
  resource_controller

  create.before do
    Review.delete(Review.find(:first, :conditions => { :product_id => params[:product_rating][:product_id], :user_id => params[:product_rating][:user_id]} ))
  end

  create.response do |wants|
    wants.html { render :json => { :average_rating => object.product.product_ratings.average('rating'), :user_rating => object.rating }.to_json, :layout => false }
  end
end
