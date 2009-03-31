require File.dirname(__FILE__) + '/../spec_helper'

describe ReviewStatus do
  before(:each) do
    @review_status = ReviewStatus.new
  end

  it "should be valid" do
    @review_status.should be_valid
  end
end
