import { Card } from "./card";
import { Player } from "./player";
import { Board } from "./board";

export class Curse extends Card {

    constructor() {
        super(Card.Deck.DOOR);
    }

    effect(player: Player, board: Board) {

    }
}