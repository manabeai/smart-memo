# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    email { Faker::Internet.unique.email }
    password { Faker::Internet.password(min_length: 8) }
    provider { "email" }
    uid { SecureRandom.uuid }
    access_token { SecureRandom.hex(16) }
    access_secret { SecureRandom.hex(16) }
    uuid { SecureRandom.uuid } # デフォルトのUUID生成関数が動作するため、DBによって生成されるようにする場合は削除も可能

    # 他の属性が必要な場合は以下に追加
    created_at { Time.current }
    updated_at { Time.current }
  end
end
