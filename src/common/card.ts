export enum CardDeck {
    DOOR = 'door',
    TREASURE = 'treasure'
}

export enum CardType {
    MONSTER = 'monster',
    CURSE = 'curese',
    ITEM = 'item',
    ONE_SHOT = 'one-shot'
}

export class Card {
    public name: string;
    public description: string;
    constructor(
        public deck: CardDeck,
        public cardType: CardType
    ) {

    }
    public static Deck = CardDeck;
    public static CardType = CardType;
}