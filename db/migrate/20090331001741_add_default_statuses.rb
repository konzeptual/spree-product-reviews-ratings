class AddDefaultStatuses < ActiveRecord::Migration
  def self.up
    ReviewStatus.create(:status => 'pending')
    ReviewStatus.create(:status => 'accepted')
    ReviewStatus.create(:status => 'denied')
  end

  def self.down
  end
end
