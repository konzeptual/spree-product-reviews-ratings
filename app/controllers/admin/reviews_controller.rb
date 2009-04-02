class Admin::ReviewsController < Admin::BaseController
  resource_controller
  layout 'admin'

  def index
    @reviews = Review.find(:all, :include => :rating)
    @statuses = ReviewStatus.find(:all)
  end

  def update_review_status
    review = Review.find(params[:id])
    review.review_status_id = params[:review_status_id]
    saved = review && review.save ? 1 : 0
    render :json => { :saved => saved }.to_json, :layout => false
  end
end
