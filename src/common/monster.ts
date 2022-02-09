import { Card } from "./card";

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

    get combatStrength() {
        return this.level;
    }
}