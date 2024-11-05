class User < ApplicationRecord
  has_many :tags, dependent: :destroy
  has_many :memos, dependent: :destroy
end
