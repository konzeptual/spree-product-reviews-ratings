SUMMARY
======

This extension allows product reviews and ratings in three varieties: reviews only, ratings only, or reviews and ratings together.

INSTALLATION
------------

1. Clone the git repo to SPREE_ROOT/vendor/extensions/product_reviews_ratings or install the extension

    git clone git://github.com/stephp/spree-product-reviews-ratings.git product_reviews_ratings

    script/extension install git://github.com/stephp/spree-product-reviews-ratings.git

2. Run rake db:migrate from SPREE_ROOT

3. Set configurations in EXTENSION_ROOT/lib/product_reviews_ratings_configurations.rb. The options are:

    :can_review_product - Set this variable equal to 0 if you want to disable product reviews.

    :can_rate_product - Set this variable equal to 0 if you want to disable product ratings.

    :default_review_status - This is the default status for product reviews upon submission. Set this equal to 2 if you want reviews to be automatically 'accepted' to display on the product page upon submission. A value of 1 signifies that the status is 'pending' and must be approved in admin before displaying on the product page.

    :review_count - This integer represents the number of reviews that show on the product page. When the product has more reviews, another page is linked to from the product page that contains all the reviews.

4. Add the view to your product page with a hook. Available product page hooks include product_description, product_properties, cart_form. Hook actions include insert_after, insert_before, replace, and delete. By default, the extension inserts the reviews_ratings view after the product_properties hook. Refer to the Spree documentation on hooks and theming to determine how to include review and ratings views into your site.

   View definitions:
   	/review_ratings/form: This view contains the form for ratings and reviews. This should be included no matter what your configuration settings are for reviews and ratings.
	/ratings/average_rating: This view contains the average rating header and value for the product. It is separate from the form because you may place this in a different location on the product page than the form.
	/reviews/all_reviews: This view contains the product reviews (limited by the review_count setting) to be displayed on the product page. It is separate from the form because you may place this in a different location on the product page than the form. 

5. Restart server

Refer to [spree: ruby on rails ecommerce][1] to learn more about spree.

[1]: http://spreecommerce.com/
