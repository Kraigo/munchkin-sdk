import { Board, BoardEvent } from "./board";
import { Monster } from "./monster";
import { Player } from "./player";
import { Choice } from "./choice"
import { Curse } from "./curse";
import { CardDeck } from "./card";
import { Combat } from "./combat";

export class Turn {
    phase: number = 0;
    combat: Combat;
    finished: boolean = false;


    constructor(
        private board: Board,
        private player: Player
    ) {}

    next() {
        switch(this.phase) {
            case 0: {
                this.kickOpenTheDoor();
                this.phase ++;
                break;
            }
            case 1: {
                if (!this.combat && this.player.canLookForTrouble()) {
                    let choice = Choice.create()
                        .add({
                            title: 'Look for Trouble',
                            callback: this.lookForTrouble
                        })
                        .add({
                            title: 'Loot the Room',
                            callback: this.lootTheRoom                      
                        });
                    this.player.makeChoice(choice);
                } else {
                    this.lootTheRoom();
                }
            }

            case 2: {
                this.charity();
                break;
            }
        }

        this.board.onChange.fire(BoardEvent.NEXT_PHASE);
    }

    kickOpenTheDoor() {
        const card = this.board.openDeck(CardDeck.DOOR);
        
        switch (true) {
            case (card instanceof Monster): {
                this.fight(this.player, <Monster>card);
                break;
            }
            case card instanceof Curse: {
                this.board.curse(this.player, <Curse>card);
                break;
            }
            default: {
                this.board.takeCard(card, this.player.cardsInHand);
                this.finished = true;
                break;
            }
        }
    }

    fight(player: Player, monster: Monster) {
        this.combat = new Combat(player, monster);
    }

    lootTheRoom() {
        return this.player;
    }

    lookForTrouble() {
        return this.player;
    }

    charity() {
        if (this.player.cardsInHand.length > this.player.maxCardsOnHand) {
            this.player.cardsInHand.splice(0, this.player.maxCardsOnHand)
        }
    }
}