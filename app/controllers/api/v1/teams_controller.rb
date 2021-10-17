# frozen_string_literal: true

class Api::V1::TeamsController < Api::V1::BaseController
  before_action :load_team, only: [:show, :update, :destroy]

  def index
    teams = current_user.teams.active + current_user.owned_teams.active
    render json: teams
  end

  def create
    @team = current_user.teams.new(team_params.merge(user: current_user))
    if @team.save
      render json: { team: @team, notice: "#{@team.name} has been created!" }
    else
      render json: { error: @team.errors.full_messages.to_sentence }, status: 422
    end
  end

  def show
    render json: { team: @team }
  end

  def update
    if @team.update(team_params)
      render json: { team: @team, notice: "#{@team.name} has been updated!" }
    else
      render json: { error: @team.errors.full_messages.to_sentence }, status: 422
    end
  end

  def destroy
    if @team.soft_delete
      render json: { team: @team, notice: "#{@team.name} has been deleted!" }
    else
      render json: { error: @team.errors.full_messages.to_sentence }, status: 422
    end
  end

  private

    def team_params
      params.require(:team).permit(:name, :description).to_h
    end

    def load_team
      @team = current_user.teams.active.find_by(id: params[:id]) || current_user.owned_teams.active.find_by(id: params[:id])
      if !@team
        render json: { error: "Could not find team with id #{params[:id]}" }, status: 404
      end
    end
end
