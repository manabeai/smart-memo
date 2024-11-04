require_dependency Rails.root.join('app/models/user').to_s

class ApplicationController < ActionController::API
  before_action :log_request_details, :set_cookie_and_guest_user_if_absent

  private

  def log_request_details
    Rails.logger.info "=== リクエスト詳細 ==="
    Rails.logger.info "HTTPメソッド: #{request.method}"
    Rails.logger.info "URL: #{request.url}"
    Rails.logger.info "パラメータ: #{params.inspect}"
    Rails.logger.info "ヘッダー: #{request.headers.to_h.select { |k, _| k.start_with?('HTTP_') }}"
    Rails.logger.info "クッキー: #{request.cookies}"
    Rails.logger.info "===================="
  end

  def set_cookie_and_guest_user_if_absent
    # リクエストからクッキーを取得
    user_session = request.cookies['user_session']

    # クッキーが空か、またはデータベースに該当するユーザーが存在しない場合
    if user_session.blank? || User.find_by(id: user_session).nil?
      # 仮ユーザーを作成
      guest_user = User.create(guest: true)

      # 新しいクッキーを設定
      response.set_cookie('user_session', {
        value: guest_user.id,  # 仮ユーザーIDをクッキーに保存
        expires: 1.hour.from_now,  # 有効期限を設定
        secure: Rails.env.production?,  # 本番環境ではsecure属性を有効に
        httponly: true,  # JavaScriptからのアクセスを防ぐ
        same_site: :none,  # SameSite属性の設定
      })

      Rails.logger.info "新しい仮ユーザーとセッションCookieを付与しました: ユーザーID #{guest_user.id}"
    else
      Rails.logger.info "既存のクッキーとユーザーが見つかりました: ユーザーID #{user_session}"
    end
  end
end
