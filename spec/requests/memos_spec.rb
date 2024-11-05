require 'rails_helper'

RSpec.describe "Memos", type: :request do
  let(:user) { create(:user) }  # ユーザーを作成


  describe "GET /memos" do
    it "returns a successful response" do
      get "/memos"
      # debugger
      expect(response).to have_http_status(:success)
    end

    it "returns the correct number of memos" do
      create_list(:memo, 3, user: user)
      get "/memos", headers: { Authorization: "Bearer #{user.access_token}" }
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end
end
