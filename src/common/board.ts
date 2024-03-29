import { Player } from "./player";
import { Card, CardDeck } from "./card";
import { Turn } from "./turn";
import { Monster } from "./monster";
import { Curse } from "./curse";
import { shuffle } from "./utils";
import { Emitter } from "./emitter";
import { Combat } from "./combat";
import { Phase } from "../phases/phase";
import { KickDoorPhase, CombatPhase, CursePhase } from "../phases";
import { BoardEvent, CardPlayedEvent, NextPhaseEvent, RollDiceEvent, RoundFinishedEvent, RoundStartedEvent, StartGameEvent } from "../events";
import { Race } from "./race";
import { Shot } from "./shot";

interface BoardOptions {
    shuffle: boolean;
}

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

    cardsInDeck: Card[] = [];
    cardsInDiscard: Card[] = [];
    cardsInPlay: Card[] = [];

    onChange = new Emitter<BoardEvent>();
    options: BoardOptions = {
        shuffle: true
    }

    constructor(options?: BoardOptions) {
        Object.assign(this.options, options);
    }

    private moveCard(card: Card, fromCollection: Card[], toCollection: Card[]) {
        const fromIndex = fromCollection.findIndex(c => c === card);
        if (fromIndex === -1) return; 
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
        
        if (this.options.shuffle) {
            shuffle(this.cardsInDeck);
        }
        this.onChange.fire(new StartGameEvent());
    }

    curse(player: Player, curse: Curse, ) {
        curse.effect(player, this);
    }

    // fight(player: Player, monster: Monster,) {
    //     this.combat = new Combat([player], [monster]);
    // }

    getCardFromDeck(deck: CardDeck) {
        let cards = this.cardsInDeck.filter(c => c.deck === deck);
        if (cards.length === 0) {
            this.shuffleDiscard();
            cards = this.cardsInDeck.filter(c => c.deck === deck)          
        }
        return cards.length > 0 ? cards[0] : null;
    }

    openDeck(deck: CardDeck) {
        const card = this.getCardFromDeck(deck)

        if (card) {
            this.moveCard(card, this.cardsInDeck, this.cardsInPlay);
            this.onChange.fire( new CardPlayedEvent(card));

            return card;
        }
    }

    drawDeck(player: Player, deck: CardDeck) {
        const card = this.getCardFromDeck(deck);

        if (card) {
            this.moveCard(card, this.cardsInDeck, player.cardsInHand);
            return card;
        }
    }

    get deckDoors() {
        return this.cardsInDeck.filter(c => c.deck === CardDeck.DOOR);
    }

    get deckTreasures() {
        return this.cardsInDeck.filter(c => c.deck === CardDeck.TREASURE);
    }

    shuffleDiscard() {
        shuffle(this.cardsInDiscard);
        this.cardsInDiscard.forEach(c => {
            this.moveCard(c, this.cardsInDiscard, this.cardsInDeck)
        });
    }

    dropCard(card: Card, fromCollection: Card[]) {
        this.moveCard(card, fromCollection, this.cardsInDiscard);
    }

    takeDoorCard(card: Card, toCollection: Card[]) {
        this.moveCard(card, this.deckDoors, toCollection);
    }
    
    takeTreasureCard(card: Card, toCollection: Card[]) {
        this.moveCard(card, this.deckTreasures, toCollection);
    }

    takeCard(card: Card, player: Player) {
        const collections = [
            this.cardsInPlay,
            this.cardsInDeck,
            this.cardsInDiscard
        ]
        for (let collection of collections) {
            for (let c of collection) {
                if (c === card) {
                    this.moveCard(card, collection, player.cardsInHand);
                    return;
                }
            }
        }
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
        for (let card of this.cardsInPlay) {
            this.dropCard(card, this.cardsInPlay);
        }
        this.onChange.fire(new RoundFinishedEvent());
    }

    setPhase(phase: Phase) {
        this.phase = phase;
        this.onChange.fire(new NextPhaseEvent(phase));
    }

    playCard(player: Player, card: Card) {
        if (player.cardsInHand.includes(card)) {
            if (card instanceof Race) {
                player.cardsInPlay = player.cardsInPlay.filter(c => !(c instanceof Race));
                this.moveCard(card, player.cardsInHand, player.cardsInPlay);
                this.onChange.fire(new CardPlayedEvent(card));
            }
            else if (card instanceof Shot) {
                this.moveCard(card, player.cardsInHand, player.cardsInPlay);
                this.onChange.fire(new CardPlayedEvent(card));
            }
        }
        else if (player.cardsInPlay.includes(card)) {
            if (!this.combat) return;
            if (card instanceof Shot) {
                this.moveCard(card, player.cardsInPlay, this.cardsInPlay);
                this.onChange.fire(new CardPlayedEvent(card));
            }

        }
    }
    playCardMonsterSide(player: Player, card: Card) {
        if (!this.combat) return;
        this.moveCard(card, player.cardsInPlay, this.cardsInPlay);
        this.combat.playMonsterSide(card);
        this.onChange.fire(new CardPlayedEvent(card));
    }

    playCardPlayerSide(player: Player, card: Card) {
        if (!this.combat) return;
        this.moveCard(card, player.cardsInPlay, this.cardsInPlay);
        this.combat.playPlayerSide(card);
        this.onChange.fire(new CardPlayedEvent(card));
    }
}