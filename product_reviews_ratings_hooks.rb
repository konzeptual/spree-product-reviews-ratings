class ProductReviewsRatingsHooks < Spree::ThemeSupport::HookListener
  insert_after :product_properties, 'reviews_ratings/show'
end
