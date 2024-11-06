class SignInsController < ApplicationController
  skip_before_action :authenticate_user
  
  def create
    if User.find_by(uuid: request.cookies["user_session"])
      Rails.logger.info "既にユーザーが存在します"
      render json: { redirect_to: '/' }, status: :ok
      return
    end
    # 仮ユーザーを作成、UUIDをセッショントークンとして使用
    new_uuid = SecureRandom.uuid
    guest_user = User.create(guest: true, uuid: new_uuid)

    # 新しいクッキーを設定
    response.set_cookie("user_session", {
      value: new_uuid,
      expires: 100.hours.from_now,
      domain: "localhost",
      secure: Rails.env.production?,
      same_site: :Lax # XXX: 開発中はNoneにするとエラーが発生。(NoneはSecureとしか使えず、SecureはTLSでのみ有効なため)
    })

    # Rails.logger.info.response
    Rails.logger.info "新しい仮ユーザーとセッションCookieを付与しました: ユーザーID #{guest_user.uuid}"
    render json: { redirect_to: '/' }, status: :ok
  end
end
