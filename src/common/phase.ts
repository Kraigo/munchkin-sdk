import { Board } from "./board";
import { CardDeck } from "./card";
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