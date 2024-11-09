class OptionsRequestController < ApplicationController
  skip_before_action :set_cookie_and_guest_user_if_absent
  ACCESS_CONTROL_ALLOW_HEADERS = %w(Origin Content-Type Accept Authorization Token Auth-Token Email X-User-Token X-User-Email).freeze
  ACCESS_CONTROL_ALLOW_METHODS = %w(GET POST PUT PATCH DELETE OPTIONS).freeze
  ACCESS_CONTROL_MAX_AGE = 86_400

  def response_preflight_request
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:4000'
    response.headers['Access-Control-Allow-Headers'] = ACCESS_CONTROL_ALLOW_HEADERS.join(',')
    response.headers['Access-Control-Allow-Methods'] = ACCESS_CONTROL_ALLOW_METHODS.join(',')
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Max-Age'] = ACCESS_CONTROL_MAX_AGE
    head :ok
    Rails.logger.info(response)
  end
end