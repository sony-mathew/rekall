# frozen_string_literal: true

class Api::V1::TeamMembersController < Api::V1::BaseController
  before_action :load_team
  before_action :load_team_member_association, only: [:show, :update, :destroy]

  def index
    team_members = @team.member_associations.active.includes(:member)
    render json: team_members.as_json(include: :member)
  end

  def create
    @member_association = @team.member_associations.new(member_params.merge(user: current_user))
    if @member_association.save
      render json: { team: @team, member_association: @member_association, user: @member_association.member, notice: "#{@member_association.user.name} has been added to the team!" }
    else
      render json: { error: @member_association.errors.full_messages.to_sentence }, status: 422
    end
  end

  def show
    render json: { team: @team, member_association: @member_association, user: @member_association.member }
  end

  def update
    if @member_association.update(member_association_params)
      render json: { member_association: @member_association, notice: "Team membership has been updated!" }
    else
      render json: { error: @member_association.errors.full_messages.to_sentence }, status: 422
    end
  end

  def destroy
    if @member_association.soft_delete
      render json: { member_association: @member_association, notice: "#{@member_association.member.name} has been removed from the team!" }
    else
      render json: { error: @member_association.errors.full_messages.to_sentence }, status: 422
    end
  end

  private

    def member_association_params
      params.require(:team_member).permit(:role).to_h
    end

    def member_params
      user = User.find_by(email: params[:email])
      if !user
        raise "Could not find user with email #{params[:email]}"
      else
        member_association_params.merge(member_id: user.id)
      end
    end

    def load_team
      @team = current_user.teams.active.find_by(id: params[:team_id]) || current_user.owned_teams.active.find_by(id: params[:team_id])
      if !@team
        render json: { error: "Could not find team with id #{params[:team_id]}" }, status: 404
      end
    end

    def load_team_member_association
      @member_association = @team.member_associations.active.find_by(member_id: params[:id])
    end
end
