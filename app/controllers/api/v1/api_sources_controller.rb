# frozen_string_literal: true

class Api::V1::ApiSourcesController < Api::V1::BaseController
  before_action :load_api_source, only: [:show, :update, :destroy]

  def index
    api_sources = [current_user.api_sources.active + current_user.team_api_sources].uniq
    render json: api_sources.flatten
  end

  def create
    @api_source = ApiSource.new(api_source_params.merge(user: current_user))
    if @api_source.save
      render json: { api_source: @api_source, notice: "#{@api_source.name.humanize} has been added to your sources!" }
    else
      render json: { error: @api_source.errors.full_messages.to_sentence }, status: 422
    end
  end

  def show
    render json: { api_source: @api_source }
  end

  def update
    if @api_source.update(api_source_params)
      render json: { api_source: @api_source, notice: "#{@api_source.name.humanize} has been updated!" }
    else
      render json: { error: @api_source.errors.full_messages.to_sentence }, status: 422
    end
  end

  def destroy
    if @api_source.user.id == current_user.id && @api_source.soft_delete
      @api_source.team_resource_associations.map { |tra| tra.soft_delete }
      render json: { api_source: @api_source, notice: "#{@api_source.name.humanize} has been deleted from your sources!" }
    else
      render json: { error: @api_source.errors.full_messages.to_sentence }, status: 422
    end
  end

  private

    def api_source_params
      params.require(:api_source).permit(:name, :host, :environment, request: {}).to_h
    end

    def load_api_source
      @api_source = ApiSource.active.find(params[:id])
    end
end
