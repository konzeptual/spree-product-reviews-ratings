require File.dirname(__FILE__) + '/../test_helper'
require 'time'

class ReviewTest < Test::Unit::TestCase
	context 'user can only have one review per product' do
		setup do
			@product = Factory(:product, :name => 'Steph has a special product and this is it', :master_price => 0)
			@product.save
			email = "foo#{Time.now.to_f.to_s}@test.com"
			@user = Factory(:user, :login => email, :email => email,
												:password => 'blah666', :password_confirmation => 'blah666')
			@user.save
		end
		should 'first review saved but second review fails' do
			@review_one = Review.new(:title => 'This Product is Awesome',
					:content => 'This Product is So Awesome. Thanks RailsDizzog.')
			@review_one.product = @product
			@review_one.user = @user
			@review_one.save!
			result = Review.find(:all, :conditions => {:product_id => @product.id, :user_id => @user.id})
			assert_equal result.size, 1
			assert_equal result[0].id, @review_one.id
			@review_two = Review.new(:title => 'Awful',
				:content => 'This product stinks like your code.')
			@review_two.product = @product
			@review_two.user = @user
			begin
				@review_two.save!
			rescue Exception => e
				@exception = e
			end
			assert_not_nil @exception
		end
	end
end

