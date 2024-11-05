FactoryBot.define do
  factory :default_tag do
    name { Faker::Lorem.unique.word }
  end
end
