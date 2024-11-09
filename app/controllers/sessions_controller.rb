require 'net/http'
require 'json'
require Rails.root.join("lib", "jwt_service")

class SessionsController < ApplicationController
  # skip_before_action :set_cookie_and_guest_user_if_absent

  # JWTを発行して返す
  def google_oauth2
    access_token = params[:access_token]
    raise "アクセストークンがありません" if access_token.blank?

    # Google APIを使ってユーザー情報を取得
    uri = URI("https://www.googleapis.com/oauth2/v3/userinfo?access_token=#{access_token}")
    response = Net::HTTP.get(uri)
    user_info = JSON.parse(response)

    # ユーザー情報に基づいて認証されたユーザーを取得、または新規作成
    user = User.find_or_create_by(uid: user_info['sub']) do |u|
      u.name = user_info['name']
    end
    
    # JWTを発行    
    token = JwtService::encode(user_id: user.id)

    render json: { jwt: token }, status: :ok
  rescue StandardError => e
    render json: { error: '認証に失敗しました', message: e.message }, status: :unauthorized
  end
end
