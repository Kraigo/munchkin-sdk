import { Player } from "./player";
import { Card, CardDeck } from "./card";
import { Turn } from "./turn";
import { Monster } from "./monster";
import { Curse } from "./curse";
import { shuffle, logger } from "./utils";
import { Emitter } from "./emitter";
import { Combat } from "./combat";
import { Phase, PhaseAction } from "../phases/phase";
import { KickDoorPhase, CombatPhase, CursePhase } from "../phases";
import { BoardEvent, CardPlayedEvent, NextPhaseEvent, RollDiceEvent, RoundFinishedEvent, RoundStartedEvent, StartGameEvent } from "../events";

// export enum BoardEvent {
//     START_GAME,
//     ERROR,
//     NEXT_PHASE,
//     CARD_PLAYED,
//     CARD_DRAWED,
//     ROUND_FINISHED,
//     ROUND_STARTED,
//     ROLL_DICE
// }
export class Board {
    players: Player[] = [];
    currentPlayer: Player;
    phase: Phase;
    combat: Combat;

    deck: Card[] = [];
    discard: Card[] = [];
    play: Card[] = [];

    onChange = new Emitter<BoardEvent>();
    onAction = new Emitter<PhaseAction>();

    constructor() {
    }

    private moveCard(card: Card, fromCollection: Card[], toCollection: Card[]) {
        const fromIndex = fromCollection.findIndex(c => c === card);
        fromCollection.splice(fromIndex, 1);
        toCollection.push(card);
    }

    private get firstPlayer() {
        const round = this.players.map(p => this.rollDice());
        const max = Math.max.call(null, round);
        const index = round.indexOf(max);
        return this.players[index];
    }

    private get nextPlayer() {
        const index = this.players.indexOf(this.currentPlayer);
        let nextIndex = index + 1;
        return this.players[nextIndex] || this.players[0]
    }

    startGame() {
        if (!(this.players && this.players.length >= 2)) {
            throw Error('Need more player (2 minimum)');
        }
        
        shuffle(this.deck);
        this.onChange.fire(new StartGameEvent());
    }

    curse(player: Player, curse: Curse, ) {
        curse.effect(player, this);
    }

    // fight(player: Player, monster: Monster,) {
    //     this.combat = new Combat([player], [monster]);
    // }

    getCardFromDeck(deck: CardDeck) {
        let cards = this.deck.filter(c => c.deck === deck);
        if (cards.length === 0) {
            this.shuffleDiscard();
            cards = this.deck.filter(c => c.deck === deck)          
        }
        return cards.length > 0 ? cards[0] : null;
    }

    openDeck(deck: CardDeck) {
        const card = this.getCardFromDeck(deck)

        if (card) {
            this.moveCard(card, this.deck, this.play);
            this.onChange.fire( new CardPlayedEvent(card));

            return card;
        }
    }

    drawDeck(player: Player, deck: CardDeck) {
        const card = this.getCardFromDeck(deck);

        if (card) {
            this.moveCard(card, this.deck, player.cardsInHand);
            return card;
        }
    }

    get deckDoors() {
        return this.deck.filter(c => c.deck === CardDeck.DOOR);
    }

    get deckTreasures() {
        return this.deck.filter(c => c.deck === CardDeck.TREASURE);
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

    

    fight(player: Player, monster: Monster): Combat {
        this.combat = new Combat(player, monster);
        return this.combat;
    }

    rollDice() {
        const result = Math.ceil(Math.random() * 6);
        this.onChange.fire(new RollDiceEvent(result));

        return result;
    }

    nextRound() {
        // if (this.phase && !this.phase.finished) {
        //     throw Error('Turn didn\'t finish');
        // }

        this.currentPlayer = this.nextPlayer;
        this.onChange.fire(new RoundStartedEvent(this.currentPlayer));

        if (!this.phase) {
            this.setPhase(new KickDoorPhase(this));
            return;
        }
            
        // this.currentTurn = new Turn(this, this.currentPlayer);
        // this.onChange.fire(BoardEvent.NEXT_TURN, this.currentPlayer);
    }

    finishRound() {
        this.phase = null;
        this.onChange.fire(new RoundFinishedEvent());
    }

    setPhase(phase: Phase) {
        this.phase = phase;
        this.onChange.fire(new NextPhaseEvent(phase));
    }
}