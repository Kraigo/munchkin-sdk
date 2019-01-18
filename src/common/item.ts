import { Card } from "./card";
import { Player } from "./player";

export enum Equipment {
    HEAD,
    BODY,
    HAND,
    FOOT,
    TWOHANDS
}

export class Item extends Card {
    bonus: number;
    equiped: boolean = false;

    equipFor?: Equipment;

    constructor() {
        super(Card.Deck.TREASURE);
    }

    combatBonus(player: Player) {
        return this.bonus;
    }

    canEnquip(player: Player) {
        const items = player.cardsInPlay
            .filter(c => c instanceof Item)
            .map(c => <Item>c)
            .filter(c => c.equiped && c.equipFor);

        if (items.length) {

            
            if (this.requiredHands > 0) {
                const busyHands = items.reduce((count, c) => {
                    if (c.equipFor === Equipment.HAND) {
                        count += 1;
                    }
                    else if (c.equipFor === Equipment.TWOHANDS) {
                        count += 2;
                    }
                    return count;
                }, 0);

                return busyHands + this.requiredHands <= player.body.hands;
            }

            return !items.some(c => c.equipFor === this.equipFor);

        }

    }

    get requiredHands() {
        if (this.equipFor === Equipment.HAND) {
            return 1;
        }
        if (this.equipFor === Equipment.TWOHANDS) {
            return 2;
        }
        return 0;
    }
}