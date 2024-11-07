require 'rails_helper'

RSpec.describe "Memos", type: :request do
  let(:user) { User.find_or_create_by(id: 1) { |u| u.email = 'test@example.com'; u.password = 'password' } }


  describe "GET /memos" do
    it "returns a successful response" do
      get "/memos", headers: { 'ACCEPT' => 'application/json' }
      # debugger
      expect(response).to have_http_status(:success)
    end

    it "returns the correct number of memos" do
      create_list(:memo, 3, user: user)
      get "/memos"
      debugger
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end
end
