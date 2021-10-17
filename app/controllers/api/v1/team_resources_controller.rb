# frozen_string_literal: true

class Api::V1::TeamResourcesController < Api::V1::BaseController
  before_action :load_team
  before_action :load_team_resource_association, only: [:show, :update, :destroy]

  def index
    team_resources = @team.resource_associations.active.includes(:resourceable)
    render json: team_resources.as_json(include: :resourceable)
  end

  def create
    @resource_association = @team.resource_associations.new(resourceable_params.merge(user: current_user))
    if @resource_association.save
      render json: { team: @team, resource_association: @resource_association, notice: "#{@resource_association.resourceable_type} (#{@resource_association.resource_id}) has been added to the team!" }
    else
      render json: { error: @resource_association.errors.full_messages.to_sentence }, status: 422
    end
  end

  def show
    render json: { team: @team, resource_association: @resource_association }
  end

  def update
    if @resource_association.update(resource_association_params)
      render json: { resource_association: @resource_association, notice: "Team resource has been updated!" }
    else
      render json: { error: @resource_association.errors.full_messages.to_sentence }, status: 422
    end
  end

  def destroy
    if @resource_association.soft_delete
      render json: { resource_association: @resource_association, notice: "#{@resource_association.resourceable_type} has been removed from the team!" }
    else
      render json: { error: @resource_association.errors.full_messages.to_sentence }, status: 422
    end
  end

  private

    def resource_association_params
      params.require(:team_resource).permit(:team_id).to_h
    end

    def resourceable_params
      resource = nil
      if params[:resourceable_type] == 'QueryGroup'
        resource = current_user.query_groups.find(params[:resourceable_id])
      elsif  params[:resourceable_type] == 'ApiSource'
        resource = current_user.api_sources.find(params[:resourceable_id])
      end

      if !resource
        raise "Could not find resource #{params[:resourceable_type]} with id #{params[:resourceable_id]}"
      else
        resource_association_params.merge(resourceable: resource)
      end
    end

    def load_team
      @team = current_user.teams.active.find_by(id: params[:team_id]) || current_user.owned_teams.active.find_by(id: params[:team_id])
      if !@team
        render json: { error: "Could not find team with id #{params[:team_id]}" }, status: 404
      end
    end

    def load_team_resource_association
      @resource_association = @team.resource_associations.active.find_by(id: params[:id])
      if !@resource_association
        render json: { error: "Could not find resource association with id #{params[:id]}" }, status: 404
      end
    end
end
