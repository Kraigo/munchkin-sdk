import { Board } from "../common/board";
import { CardDeck } from "../common/card";
import { Choice, ChoiceAction } from "../common";

export enum PhaseAction {
    RUN = 'run'
}

export class Phase {    
    public finished: boolean;
    public choice: Choice;

    constructor(
        readonly board: Board
    ) {}

    action(action: ChoiceAction) {
        return this.choice.trigger(action)
    }
}