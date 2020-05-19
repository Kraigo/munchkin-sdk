import { Card } from "./card";
import { Player } from "./player";

export class Shot extends Card {
    bonus: number = 0;

    constructor() {
        super(Card.Deck.TREASURE);
    }

    combatBonus() {
        return this.bonus;
    }
}