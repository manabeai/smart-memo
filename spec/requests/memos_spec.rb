require 'rails_helper'

RSpec.describe "Memos", type: :request do
  let(:user) { User.find_or_create_by(id: 1) { |u| u.email = 'test@example.com'; u.password = 'password' } }

  describe "GET /memos" do
    it "returns a successful response" do
      get "/memos"

      expect(response).to have_http_status(:success)
    end

    it "returns the correct number of memos" do
      create_list(:memo, 3, user: user)
      get "/memos"

      expect(JSON.parse(response.body).size).to eq(3)
    end
  end

  describe "POST /memos" do
    it "returns a successful response" do
      create_list(:default_tag, 4)
      create_list(:tag, 5, user: user)
      post "/memos", params: { title: "Test", content: "Test" }

      expect(response).to have_http_status(:success)
    end

    it "make suggestion of memo" do
      pending "まだコントローラーを作っていないので"
      create_list(:default_tag, 4)
      create_list(:tag, 5, user: user)
      post "/memos", params: { title: "Test", content: "Test" }

      expect(JSON.parse(response.body)["title"]).to eq("Test")
      expect(JSON.parse(response.body)["content"]).to eq("Test")
      expect(JSON.parse(response.body)["tags"]).to be_an_instance_of(Array)
    end
  end

  describe "POST /memos/create" do
    it "create a new memo" do
      create_list(:default_tag, 4)
      create_list(:tag, 5, user: user)
      initial_memo_count = Memo.count
      initial_tag_count = Tag.count
      tag = Tag.all.sample
      post "/memos/create", params: { title: "test", content: "Testcontent", tags: [ { name: DefaultTag.all.sample, is_user_defined: nil }, { name: tag.name, is_user_defined: tag.user } ] }

      expect(JSON.parse(response.body)["title"]).to eq("test")
      expect(Memo.count) == initial_memo_count + 1
      expect(Tag.count)  == initial_tag_count + 1
    end
  end

  describe "PATCH /memos/:id" do
    it "returns a successful response" do
      create_list(:memo, 5, user: user)
      create_list(:tag, 5, user: user)
      sample_memo = Memo.all.sample
      Tagging.create(memo: sample_memo, tag: Tag.first)
      Tagging.create(memo: sample_memo, tag: Tag.second)
      patch "/memos/#{Memo.first.id}", params: { id: sample_memo.id, title: "patch", content: "change", tags: [ { id: Tag.second.id, name: Tag.second.name }, { id: Tag.last.id, name: Tag.last.name } ] }

      expect(response).to have_http_status(:success)
    end

    it "update the memo" do
      create_list(:memo, 5, user: user)
      create_list(:tag, 5, user: user)
      sample_memo = Memo.all.sample
      Tagging.create(memo: sample_memo, tag: Tag.first)
      Tagging.create(memo: sample_memo, tag: Tag.second)

      patch "/memos/#{sample_memo.id}", params: { id: sample_memo.id, title: "patch", content: "change", tags: [ { id: Tag.second.id, name: Tag.second.name }, { id: Tag.last.id, name: Tag.last.name } ] }

      expect(Memo.find(sample_memo.id).title).to eq("patch")
      expect(Memo.find(sample_memo.id).content).to eq("change")
      expect(Memo.find(sample_memo.id).tags.size).to eq(2)
      expect(Memo.find(sample_memo.id).tags.pluck(:id)).to eq([ Tag.second.id, Tag.last.id ])
      expect(Memo.find(sample_memo.id).tags.pluck(:name)).to eq([ Tag.second.name, Tag.last.name ])
    end
  end

  describe "DELETE /memos/:id" do
    it "returns a successful response" do
      create_list(:memo, 5, user: user)
      delete "/memos/#{Memo.first.id}"
      expect(response).to have_http_status(204)
    end

    it "delete the memo" do
      create_list(:memo, 5, user: user)
      initial_memo_count = Memo.count
      initial_memo_id = Memo.first.id
      delete "/memos/#{Memo.first.id}"

      expect(Memo.count).to eq(initial_memo_count - 1)
      expect(Memo.where(id: initial_memo_id)).to be_empty
    end
  end
end
