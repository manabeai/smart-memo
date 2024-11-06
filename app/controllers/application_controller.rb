class ApplicationController < ActionController::API
  before_action :log_request_details, :authenticate_user

  def initialize
    @user_uuid = 1
    @default = 1
  end

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

  def authenticate_user
    # リクエストからクッキーを取得
    user_session = request.cookies["user_session"]

    # クッキーが空か、またはデータベースに該当するユーザーが存在しない場合一時ユーザー作成
    if user_session.blank? || User.find_by(uuid: user_session).nil?
      Rails.logger.info "既存のクッキーとユーザーが見つかりませんでした"
      render json: { error: 'Unauthorized' }, status: :unauthorized, location: '/sign_ins'
      return
    else
      Rails.logger.info "既存のクッキーとユーザーが見つかりました: ユーザーID #{user_session}"
      @user_id = User.find_by(uuid: user_session).id
      Rails.logger.info "ユーザーID #{@user_id}"
    end
  end
end
