class ReviewsController < Spree::BaseController
  resource_controller

  create.before do
    user_review = Review.find(:first, :conditions => { :product_id => params[:review][:product_id], :user_id => params[:review][:user_id]} )
    Review.delete(user_review) if user_review
  end

  create.response do |wants|
    wants.html { render :json => { :title => object.title, :content => object.content, :id => object.id, :user_id => object.user_id, :status => object.review_status_id }.to_json, :layout => false }
  end
end
