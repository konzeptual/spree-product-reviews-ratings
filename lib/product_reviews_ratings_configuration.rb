class ProductReviewsRatingsConfiguration < Configuration
  preference :can_review_product, :integer, :default => 1
  preference :can_rate_product, :integer, :default => 1
end
