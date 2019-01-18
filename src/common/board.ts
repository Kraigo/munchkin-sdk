import { Player } from "./player";
import { Card, CardDeck } from "./card";
import { Turn } from "./turn";
import { Monster } from "./monster";
import { Curse } from "./curse";
import { shuffle, logger } from "./utils";

export class Board {
    players: Player[];
    currentPlayer: Player;
    currentTurn: Turn;

    deck: Card[];
    discard: Card[];
    play: Card[];

    constructor() {
        this.deck = [];
        this.discard = [];
    }

    private moveCard(card: Card, fromCollection: Card[], toCollection: Card[]) {
        const fromIndex = fromCollection.findIndex(c => c === card);
        fromCollection.splice(fromIndex, 1);
        toCollection.push(card);
    }

    get firstPlayer() {
        const round = this.players.map(p => this.rollDice());
        const max = Math.max.call(null, round);
        const index = round.indexOf(max);
        return this.players[index];
    }

    get nextPlayer() {
        const index = this.players.indexOf(this.currentPlayer);
        let nextIndex = index + 1;        
        if ( nextIndex >= this.players.length) {
            nextIndex = 0;
        }
        return this.players[nextIndex];
    }

    startGame() {
        if (!(this.players && this.players.length >= 2)) {
            throw new Error('Need more player (2 minimum)')
        }

        logger("Game started!");
        this.nextTurn();
    }

    curse(curse: Curse, player: Player) {
        curse.effect(player, this);
    }

    combat(monster: Monster, player: Player) {
        
    }

    openDeck(deck: CardDeck) {
        let cards = this.deck.filter(c => c.deck === deck);
        if (cards.length === 0) {
            this.shuffleDiscard();
            cards = this.deck.filter(c => c.deck === deck)          
        }
        const card = cards.length > 0 ? cards[0] : null;

        if (card) {
            this.moveCard(card, this.deck, this.play);
        }
        return card;
    }

    shuffleDiscard() {
        shuffle(this.discard);
        this.discard.forEach(c => {
            this.moveCard(c, this.discard, this.deck)
        });
    }

    playCard(card: Card, fromCollection: Card[]) {
        this.moveCard(card, fromCollection, this.play);
    }

    dropCard(card: Card, fromCollection: Card[]) {
        this.moveCard(card, fromCollection, this.discard);
    }

    takeCard(card: Card, toCollection: Card[]) {
        this.moveCard(card, this.play, toCollection);
    }

    rollDice() {
        return Math.ceil(Math.random() * 6);
    }

    nextTurn() {
        this.currentPlayer = this.currentPlayer
            ? this.nextPlayer
            : this.firstPlayer;
            
        this.currentTurn = new Turn(this);
    }
}