class Admin::ReviewsController < Admin::BaseController
  resource_controller
  layout 'admin'

  def index
    @reviews = Review.find(:all)
    @statuses = ReviewStatus.find(:all)
  end
end
