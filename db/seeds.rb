# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Post.create!(
  [
    {
      title: '一石二鳥'
    },
    {
      title: '七転八起'
    },
    {
      title: '温故知新'
    },
    {
      title: '千載一遇'
    },
    {
      title: '風林火山'
    }
  ]
)

# db/seeds.rb

# 既存のデータを削除（開発環境のため）
# User.destroy_all
Tag.destroy_all
Memo.destroy_all
Tagging.destroy_all
DefaultTag.destroy_all

# ユーザーを作成
users = User.create!([
  { email: 'user1@example.com', password: 'password', uuid: SecureRandom.uuid, guest: true },
  { email: 'user2@example.com', password: 'password', uuid: SecureRandom.uuid, guest: true },
  { email: 'user3@example.com', password: 'password', uuid: SecureRandom.uuid, guest: false },
  { email: 'user4@example.com', password: 'password', uuid: SecureRandom.uuid, guest: false }
])

DefaultTag.create([
  { name: '健康' },
  { name: 'ゲーム' },
  { name: '数学' }
])

tags = Tag.create([
  { user_id: users[0].id, name: '読書' },
  { user_id: users[0].id, name: '勉強' },
  { user_id: users[1].id, name: '旅行' },
  { user_id: users[1].id, name: '映画' },
  { user_id: users[2].id, name: '料理' },
  { user_id: users[2].id, name: 'ダンス' },
  { user_id: users[3].id, name: '音楽' },
  { user_id: users[3].id, name: 'スポーツ' },
  { user_id: users[0].id, name: '健康' },
  { user_id: users[1].id, name: 'ゲーム' },
  { user_id: users[2].id, name: '数学' },
  { user_id: users[3].id, name: '技術' }
])
# メモを作成
memos = []
20.times do |i|
  user = users.sample # ランダムにユーザーを選択
  memo = Memo.create!(title: "メモタイトル #{i + 1}", content: "メモの内容 #{i + 1}", user_id: user.id) # user_id を直接設定
  memos << memo
end

# # タグ付けを作成（最大30ペアになるように）
taggings = Set.new  # 重複を避けるためにSetを使用

while taggings.size < 30 do
  memo = users.sample.memos.sample
  tag = users.sample.tags.sample

  # ユニークなペアであることを確認
  pair = [ memo.id, tag.id ]
  taggings.add(pair)
end

# # 実際のデータベースにペアを挿入
taggings.each do |memo_id, tag_id|
  Tagging.create!(memo_id: memo_id, tag_id: tag_id)
end

puts "Seed data created successfully!"
