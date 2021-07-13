# frozen_string_literal: true

class Api::V1::QueryGroupsController < Api::V1::BaseController
  before_action :load_query_group, only: [:show, :update, :destroy]

  def index
    query_groups = current_user.query_groups.active
    render json: query_groups
  end

  def create
    @query_group = current_user.query_groups.new(query_group_params)
    if @query_group.save
      render json: { query_group: @query_group, notice: "#{@query_group.name.humanize} has been added to your query groups!" }
    else
      render json: { error: @query_group.errors.full_messages.to_sentence }, status: 422
    end
  end

  def show
    render json: { query_group: @query_group }
  end

  def update
    if @query_group.update(query_group_params)
      render json: { query_group: @query_group, notice: "#{@query_group.name.humanize} has been updated!" }
    else
      render json: { error: @query_group.errors.full_messages.to_sentence }, status: 422
    end
  end

  def destroy
    if @query_group.soft_delete
      render json: { query_group: @query_group, notice: "#{@query_group.name.humanize} has been deleted from your query groups!" }
    else
      render json: { error: @query_group.errors.full_messages.to_sentence }, status: 422
    end
  end

  private

    def query_group_params
      params.require(:query_group).permit(:name, 
        :api_source_id,
        :scorer_id,
        :http_method,
        :page_size,
        :query_string,
        :document_uuid,
        :transform_response,
        request_body: {},
        document_fields: []
      ).to_h
    end

    def load_query_group
      @query_group = current_user.query_groups.active.find(params[:id])
    end
end
