export enum CardDeck {
    DOOR = 'door',
    TREASURE = 'treasure'
}

export class Card {
    public name: string;
    public description: string;
    constructor(
        public deck: CardDeck
    ) {

    }
    public static Deck = CardDeck;
}