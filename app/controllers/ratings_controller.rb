class RatingsController < Spree::BaseController
  resource_controller

  create.before do
    user_rating = Rating.find(:first, :conditions => { :product_id => params[:rating][:product_id], :user_id => params[:rating][:user_id]} )
    Rating.delete(user_rating) if user_rating 
  end

  create.response do |wants|
    wants.html { render :json => { :average_rating => object.product.ratings.average('rating'), :user_rating => object.rating }.to_json, :layout => false }
  end
end
