import { Card } from "./card";

export class Monster extends Card {

    rewardLevels: number = 1;
    rewardTreasurs: number = 1;
    isUnded: boolean = false;

    level: number = 1;


    constructor() {
        super(Card.Deck.DOOR, Card.CardType.MONSTER);
    }

    wandering() {
        
    }

    get combatStrength() {
        return this.level;
    }
}