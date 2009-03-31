require File.dirname(__FILE__) + '/../spec_helper'

describe Review do
  before(:each) do
    @review = Review.new
  end

  it "should be valid" do
    @review.should be_valid
  end
end
