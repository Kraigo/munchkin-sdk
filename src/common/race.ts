import { Card } from "./card";

export enum Races {
    HUMAN,
    ELF
}

export class Race extends Card {
    race: Races;

    constructor() {
        super(Card.Deck.DOOR)
    }
}