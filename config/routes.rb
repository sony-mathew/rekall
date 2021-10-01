# frozen_string_literal: true

require "sidekiq/web"

Rails.application.routes.draw do

  devise_for :users, path_prefix: "devise", controllers: { registrations: "registrations" }
  get "/logout" => "sessions#destroy", :as => :logout
  devise_scope :user do
    scope "my" do
      put "profile/update", to: "registrations#update"
      put "password/update", to: "registrations#update_password"
    end
  end

  authenticate :user, ->(u) { u.super_admin? } do
    mount Sidekiq::Web, at: "/sidekiq"

    ActiveAdmin.routes(self)
    namespace :superadmin do
      root to: "users#index"
      resources :users
    end
  end

  authenticate :user, ->(u) { !u.super_admin? } do
    get "/active_admin" => redirect("/")
  end

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      devise_scope :user do
        post "login" => "sessions#create", as: "login"
        delete "logout" => "sessions#destroy", as: "logout"
      end

      resources :users, only: [:show, :create, :update, :destroy], constraints: { id: /.*/ }
      
      resources :notes, only: [:index, :create] do
        collection do
          post 'bulk_delete'
        end
      end

      resources :api_sources, only: [:index, :create, :show, :update, :destroy]
      resources :scorers, only: [:index, :create, :show, :update, :destroy]
      
      resources :query_groups, only: [:index, :create, :show, :update, :destroy] do
        resources :queries, only: [:index, :create, :show, :update, :destroy] do
          resources :results, only: [:index, :show, :update, :destroy] do
            collection do
              post 'fetch_fresh_results'
            end

            member do
              post 'register_score'
            end
          end
        end
      end

      resources :teams, only: [:index, :create, :show, :update, :destroy] do
        resources :members, controller: "team_members", only: [:index, :create, :show, :update, :destroy]
        resources :resources, controller: "team_resources", only: [:index, :create, :show, :update, :destroy]
      end
    end
  end

  root "home#index"
  get "/healthcheck", to: proc { [200, {}, [{ status: "Up", timestamp: Time.now.to_s }.to_json]] }
  get '*path', to: 'home#index', via: :all
end