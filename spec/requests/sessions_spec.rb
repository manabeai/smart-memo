require 'rails_helper'

RSpec.describe "Sessions", type: :request do
  describe "GET /google_auth2" do
    it "returns http success" do
      get "/sessions/google_auth2"
      expect(response).to have_http_status(:success)
    end
  end

end
