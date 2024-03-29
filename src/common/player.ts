import { Card } from "./card";
import { Item } from "./item";
import { Monster } from "./monster";
import { Choice } from "./choice";
import { Emitter } from "./emitter";
import { Race, Races } from "./race";

enum Gender {
    MALE,
    FEMALE
}

export enum PlayerEvent {
    COMBAT
}

export interface PlayerOptions {
    name?: string;
    gender?: Gender;
}

export class PlayerBody {
    constructor(private player: Player) {}
    get head() {
        return 1;
    }
    get hands() {
        return 2;
    }
    get foots() {
        return 1;
    }
    get chair() {
        return 1;
    }
}

export class Player {
    public name: string;
    public gender: Gender;
    public level: number = 1;

    public cardsInHand: Card[] = [];
    public cardsInPlay: Card[] = [];

    public body: PlayerBody;
    public onChoice: Emitter<PlayerEvent> = new Emitter<PlayerEvent>();

    // constructor(...init: Partial<Player>[]) {
    //     Object.assign(this, ...init);
    // }
    constructor(options?: PlayerOptions) {
        Object.assign(this, options);
        this.body = new PlayerBody(this);
    }

    get bonuses() {
        const itemsBonus = this.cardsInPlay
            .filter(i => i instanceof Item)
            .map(i => <Item>i)
            .reduce((cur, i) => cur + i.combatBonus(this), 0);
        return itemsBonus;
    }

    get maxCardsOnHand() {
        return 5;
    }

    get race(): Races {
        const card = this.cardsInPlay.find(c => c instanceof Race) as Race;
        return card ? card.race : Races.HUMAN;
    }

    gotUpLevel(num = 1) {
        this.level += num;
    }

    loseLevel(num = 1) {
        const minLevel = 1;
        const newLevel = this.level - num;
        this.level = newLevel >= minLevel
            ? newLevel
            : minLevel;
    }

    makeChoice(choice: Choice) {
        const choises = choice.options;

        let promptResult: string;
        let promptChoice: number;
        let title = '';
        for(let i = 0; i < choises.length; i++) {
            title += `${i + 1}. ${choises[i]}\n`
        }
    
        do {
            promptResult = prompt(title, '1');
            promptChoice = parseInt(promptResult);
    
        } while (promptChoice <= 0 || promptChoice > choises.length);

        return choises[promptChoice - 1];
    }

    canLookForTrouble() {
        return this.cardsInHand.some(i => i instanceof Monster);
    }

    // dropCardFromGame(card: Card) {
    //     this.dropCard(this.cardsOnHand, card);
    //     logger(`Player ${this.name} lost card from game`);
    // }

    // dropCardFromHand(card: Card) {
    //     this.dropCard(this.cardsOnHand, card);
    //     logger(`Player ${this.name} lost card from hand`);
    // }

    // private dropCard(hand: Card[], card: Card) {
    //     const index = hand.findIndex(c => c === card);
    //     if (index >= 0) {
    //         hand.splice(index, 1);
    //     }
    // }
}