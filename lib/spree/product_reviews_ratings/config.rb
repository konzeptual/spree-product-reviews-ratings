module Spree
  module ProductReviewsRatings
    # Singleton class to access the google base configuration object (ProductReviewsRatingsConfiguration.first by default) and it's preferences.
    #
    # Usage:
    #   Spree::ProductReviewsRatings::Config[:foo]                  # Returns the foo preference
    #   Spree::ProductReviewsRatings::Config[]                      # Returns a Hash with all the google base preferences
    #   Spree::ProductReviewsRatings::Config.instance               # Returns the configuration object (ProductReviewsRatingsConfiguration.first)
    #   Spree::ProductReviewsRatings::Config.set(preferences_hash)  # Set the google base preferences as especified in +preference_hash+
    class Config
      include Singleton
      include PreferenceAccess

      class << self
        def instance
          return nil unless ActiveRecord::Base.connection.tables.include?('configurations')
          ProductReviewsRatingsConfiguration.find_or_create_by_name("Default product reviews and ratings configuration")
        end
      end
    end
  end
end

