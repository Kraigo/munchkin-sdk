import { Board } from "./board";
import { CardDeck } from "./card";

export enum PhaseAction {
    RUN = 'run'
}

export class Phase {    
    public finished: boolean;

    constructor(
        readonly board: Board
    ) {}

    canRun() {
        return false;
    }

    canPlayCard() {
        return false;
    }

    canDrawCard(deck: CardDeck) {
        return false;
    }

    canOpenDoor() {
        return false;
    }

    action() {}
}