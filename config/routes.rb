=begin
SmartMemo API

SmartMemoのAPI仕様書

The version of the OpenAPI document: 1.0.0
Generated by: https://github.com/openapitools/openapi-generator.git

=end
Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  def add_openapi_route (http_method, path, opts = {})
    full_path = path.gsub(/{(.*?)}/, ':\1')
    match full_path, to: "#{opts.fetch(:controller_name)}##{opts[:action_name]}", via: http_method
  end
  add_openapi_route "POST", "/memos/create", controller_name: "memos", action_name: "create_memo"
  add_openapi_route "DELETE", "/memos/{id}", controller_name: "memos", action_name: "destroy"
  add_openapi_route "GET", "/memos/{id}", controller_name: "memos", action_name: "show"
  add_openapi_route "GET", "/memos", controller_name: "memos", action_name: "index"
  add_openapi_route "POST", "/memos", controller_name: "memos", action_name: "create"
  add_openapi_route "PATCH", "/memos/{id}", controller_name: "memos", action_name: "update"
  add_openapi_route "POST", "/tags", controller_name: "tags", action_name: "create"
  add_openapi_route "DELETE", "/tags/{id}", controller_name: "tags", action_name: "destroy"
  add_openapi_route "GET", "/tags", controller_name: "tags", action_name: "index"
  add_openapi_route "PATCH", "/tags/{id}", controller_name: "tags", action_name: "update"
  add_openapi_route "POST", "/sign_ins", controller_name: "sign_ins", action_name: "create"
  resources :posts
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
