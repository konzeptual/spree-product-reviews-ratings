map.resources :ratings
map.resources :reviews

map.namespace :admin do |admin|
  admin.resources :reviews
end

map.resources :products, :has_many => :reviews
