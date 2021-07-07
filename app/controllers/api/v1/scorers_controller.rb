# frozen_string_literal: true

class Api::V1::ScorersController < Api::V1::BaseController
  before_action :load_scorer, only: [:show, :update, :destroy]

  def index
    scorers = Scorer.common + current_user.scorers.active
    render json: scorers
  end

  def create
    @scorer = current_user.scorers.new(scorer_params)
    if @scorer.save
      render json: { scorer: @scorer, notice: "#{@scorer.name.humanize} has been added to your scorers!" }
    else
      render json: { error: @scorer.errors.full_messages.to_sentence }, status: 422
    end
  end

  def show
    render json: { scorer: @scorer }
  end

  def update
    if @scorer.update(scorer_params)
      render json: { scorer: @scorer, notice: "#{@scorer.name.humanize} has been updated!" }
    else
      render json: { error: @scorer.errors.full_messages.to_sentence }, status: 422
    end
  end

  def destroy
    if @scorer.soft_delete
      render json: { scorer: @scorer, notice: "#{@scorer.name.humanize} has been deleted from your scorers!" }
    else
      render json: { error: @scorer.errors.full_messages.to_sentence }, status: 422
    end
  end

  private

    def scorer_params
      params.require(:scorer).permit(:name, :name, :code, :scale_type, scale: {}, ).to_h
    end

    def load_scorer
      @scorer = current_user.scorers.active.find(params[:id])
    end
end
