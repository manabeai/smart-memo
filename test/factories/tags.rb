# spec/factories/tags.rb
FactoryBot.define do
  factory :tag do
    association :user
    name { Faker::Lorem.unique.word }
  end
end
