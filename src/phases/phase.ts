import { Board } from "../common/board";
import { Choice, ChoiceAction } from "../common";

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