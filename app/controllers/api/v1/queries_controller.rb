# frozen_string_literal: true

class Api::V1::QueriesController < Api::V1::BaseController
  before_action :load_query_group
  before_action :load_query, only: [:show, :update, :destroy]

  def index
    queries = @query_group.queries.active
    render json: queries
  end

  def create
    @query = @query_group.queries.new(query_model_params.merge(user: current_user))
    if @query.save
      render json: { query_group: @query, notice: "#{@query.query_text.humanize} has been added to your queries!" }
    else
      render json: { error: @query.errors.full_messages.to_sentence }, status: 422
    end
  end

  def show
    render json: { query: @query }
  end

  def update
    if @query.update(query_model_params)
      render json: { query: @query, notice: "#{@query.query_text.humanize} has been updated!" }
    else
      render json: { error: @query.errors.full_messages.to_sentence }, status: 422
    end
  end

  def destroy
    if @query.soft_delete
      render json: { query: @query, notice: "#{@query.query_text.humanize} has been deleted from your queries!" }
    else
      render json: { error: @query.errors.full_messages.to_sentence }, status: 422
    end
  end

  private

    def query_model_params
      params.require(:query).permit(:query_text, :notes).to_h
    end

    def load_query_group
      @query_group = QueryGroup.active.find(params[:query_group_id])
    end

    def load_query
      @query = @query_group.queries.active.find(params[:id])
    end
end
