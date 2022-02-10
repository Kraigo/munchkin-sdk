import { Board } from "./board";
import { Card } from "./card";
import { Player } from "./player";

export class Monster extends Card {

    rewardLevels: number = 1;
    rewardTreasures: number = 1;
    isUnded: boolean = false;

    level: number = 1;


    constructor() {
        super(Card.Deck.DOOR);
    }

    wandering() {
        
    }

    get combatPower() {
        return this.level;
    }


    penalty(player: Player) {

    }
}