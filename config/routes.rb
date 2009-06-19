map.resources :reviews_ratings

map.namespace :admin do |admin|
  admin.resources :reviews
end

map.connect 'products/:id/reviews', :controller => 'reviews_ratings', :action => 'index'
