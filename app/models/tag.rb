class Tag < ApplicationRecord
  belongs_to :user
  has_many :taggings, dependent: :destroy
  has_many :memos, through: :taggings, dependent: :destroy
end
