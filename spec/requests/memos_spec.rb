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
    it "returns a succsessful response" do
      create_list(:default_tag, 4)
      create_list(:tag, 5, user: user)
      tag = Tag.all.sample
      post "/memos/create", params: { title: "test", content: "Testcontent", tags: [ { name: DefaultTag.all.sample, is_user_defined: nil }, { name: tag.name, is_user_defined: tag.user } ] }
      expect(JSON.parse(response.body)["title"]).to eq("test")
    end
  end
end
