FactoryBot.define do
  factory :tagging do
    association :memo
    association :tag
  end
end
