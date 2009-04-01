map.resources :ratings
map.resources :reviews

map.namespace :admin do |admin|
  admin.resources :reviews
end
