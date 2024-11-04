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

    # クッキーが空か、またはデータベースに該当するユーザーが存在しない場合一時ユーザー作成
    if user_session.blank? || User.find_by(uuid: user_session).nil?
      
      # 仮ユーザーを作成、UUIDをセッショントークンとして使用
      new_uuid = SecureRandom.uuid
      guest_user = User.create(guest: true, uuid: new_uuid)

      # 新しいクッキーを設定
      response.set_cookie('user_session', {
        value: new_uuid,
        expires: 100.hours.from_now,
        domain: "localhost",
        secure: Rails.env.production?,
        same_site: :None,
      })

      # Rails.logger.info.response
      Rails.logger.info "新しい仮ユーザーとセッションCookieを付与しました: ユーザーID #{guest_user.uuid}"
    else
      Rails.logger.info "既存のクッキーとユーザーが見つかりました: ユーザーID #{user_session}"
    end
  end
end
