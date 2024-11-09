require 'jwt'

class JwtService
  # シークレットキー（環境変数に保存することをお勧めします）
  SECRET_KEY = Rails.application.credentials.secret_key_base

  # JWTのエンコードメソッド
  def self.encode(payload, exp = 24.hours.from_now)
    # ペイロードに有効期限（exp）を追加
    payload[:exp] = exp.to_i
    # JWTをエンコードして返す
    JWT.encode(payload, SECRET_KEY)
  end

  # JWTのデコードメソッド
  def self.decode(token)
    begin
      # トークンをデコードしてペイロードを返す
      decoded_token = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })
      # デコードされたペイロードを返す
      decoded_token["payload"]
    rescue JWT::DecodeError => e
      # デコードエラーが発生した場合、nilを返す
      nil
    end
  end
end
