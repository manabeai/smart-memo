# spec/factories/memos.rb
FactoryBot.define do
  factory :memo do
    association :user
    title { Faker::Lorem.sentence(word_count: 3) }
    content { Faker::Lorem.paragraph }
  end
end
