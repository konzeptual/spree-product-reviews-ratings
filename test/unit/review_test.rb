require File.dirname(__FILE__) + '/../test_helper'
#require File.dirname(__FILE__) + '/../extension_factories'
require 'time'

class ReviewTest < Test::Unit::TestCase
	context 'user can only have one review per product' do
		setup do
			@product = Factory(:product)
			@product.save
			email = "foo#{Time.now.to_f.to_s}@test.com"
			@user = Factory(:user, :login => email, :email => email)
			@user.save
		end
		should 'first review saved but second review fails' do
			#@review_one = Factory(:review)
			@review_one = Review.new(:content => 'This is awesome!')
			@review_one.product = @product
			@review_one.user = @user
			@review_one.save
			result = Review.find(:all, :conditions => {:product_id => @product.id, :user_id => @user.id})
			assert_equal result.size, 1
			assert_equal result[0].id, @review_one.id
			#@review_two = Factory.review(:review)
			@review_two = Review.new(:content => 'This is awful!')
			@review_two.product = @product
			@review_two.user = @user
			begin
				@review_two.save!
			rescue Exception => e
				@exception = e
			end
			assert_not_nil @exception
		end
		should 'allow review to have and not have rating' do
			#@review_one = Factory(:review)
			@review_one = Review.new(:content => 'This is awesome!')
			@review_one.product = @product
			@review_one.user = @user
			@review_one.save
			assert_not_nil @review_one
			assert_nil @review_one.rating
			#@review_two = Factory(:review)
			@review_two = Review.new(:content => 'This is awful!')
			#@rating = Factory(:rating)
			@rating = Rating.new(:rating => 3)
			@rating.product = @product
			@rating.user = @user
			@review_two.rating = @rating
			@review_two.save
			@rating.save
			assert_not_nil @review_two
			assert_not_nil @rating
			assert_equal @review_two.id, @rating.review_id
		end
	end
end

