# frozen_string_literal: true

class Api::V1::SnapshotsController < Api::V1::BaseController
  before_action :load_query_group
  before_action :load_query
  before_action :load_query_result, only: [:create]
  before_action :load_snapshot, only: [:show, :update, :destroy]
  before_action :validate_compare_params, only: [:compare]

  def index
    render json: { snapshots: @query.snapshots.active, notice: "Fetched the latest snapshots!" }
  end

  def create
    generate_snapshot
    if @snapshot.save
      render json: { snapshot: @snapshot, notice: "#{@snapshot.name} has been created!" }
    else
      render json: { error: @snapshot.errors.full_messages.to_sentence }, status: 422
    end
  end

  def compare
    #TODO
    # if @query 
    #   
    # else
    #   render json: { error: "Some error occurred." }, status: 422
    # end
  end

  def show
    render json: { snapshot: @snapshot }
  end

  def update
    if @snapshot.update(snapshot_params)
      render json: { snapshot: @snapshot, notice: "Snapshot has been updated!" }
    else
      render json: { error: @snapshot.errors.full_messages.to_sentence }, status: 422
    end
  end

  def destroy
    if @snapshot.soft_delete
      render json: { snapshot: @snapshot, notice: "Snapshot has been deleted!" }
    else
      render json: { error: @snapshot.errors.full_messages.to_sentence }, status: 422
    end
  end

  private

    def snapshot_params
      params.fetch(:snapshot, {}).permit(:notes, :name).to_h
    end

    def validate_compare_params
      #TODO
      # if !@query_group.scorer.is_valid_scale_value?(params[:score])
      #   render json: { error: "Score value should be in #{@query_group.scorer.scale.inspect}", notice: "Score value should be in #{@query_group.scorer.scale.inspect}" }, status: 422
      #   return
      # end

      # if !@result.has_document?(params[:doc])
      #   render json: { error: "document_uuid should be in results", notice: " document_uuid should be in results" }, status: 422
      # end
    end

    def load_query_group
      @query_group = QueryGroup.active.find(params[:query_group_id])
    end

    def load_query
      @query = @query_group.queries.active.find(params[:query_id])
    end

    def load_query_result
      @result = @query.active_result
    end

    def load_snapshot
      @snapshot = @query.snapshots.active.find(params[:id])
    end

    def generate_snapshot
      @snapshot  = @query.snapshots.new(snapshot_params)
      @snapshot.query_group = @query_group
      @snapshot.user = current_user
      @snapshot.result = @result
      @snapshot.latest_score = @result.latest_score
      @snapshot.data = {
        query: @query.as_json,
        result: @result.as_json
      }
      @snapshot.name = "#{@query.query_text} - #{Time.now.strftime("%d %b, %Y")}"
      @snapshot
    end
end
