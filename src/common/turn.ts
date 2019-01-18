import { Board } from "./board";
import { Monster } from "./monster";
import { Player } from "./player";
import { Choice } from "./choice"
import { Curse } from "./curse";
import { CardDeck } from "./card";

export class Turn {
    currentStep: number = 0;
    wasCombat: boolean = false;


    constructor(
        private board: Board) {

    }

    get currentPlayer(): Player {
        return this.board.currentPlayer;
    }

    next() {
        switch(this.currentStep) {
            case 0: {
                this.kickOpenTheDoor();
                this.currentStep ++;
                break;
            }
            case 1: {
                if (!this.wasCombat && this.currentPlayer.canLookForTrouble()) {
                    let choice = Choice.create()
                        .add({
                            title: 'Look for Trouble',
                            callback: this.lookForTrouble
                        })
                        .add({
                            title: 'Loot the Room',
                            callback: this.lootTheRoom                      
                        });
                    this.currentPlayer.makeChoice(choice);
                } else {
                    this.lootTheRoom();
                }
            }

            case 2: {
                this.charity();
                break;
            }
        }
    }

    kickOpenTheDoor() {
        const card = this.board.openDeck(CardDeck.DOOR);
        
        switch (true) {
            case (card instanceof Monster): {
                this.board.combat(<Monster>card, this.currentPlayer);
                this.wasCombat = true;
                break;
            }
            case card instanceof Curse: {
                this.board.curse(<Curse>card, this.currentPlayer);
                break;
            }
            default: {
                this.board.takeCard(card, this.currentPlayer.cardsInHand);
                break;
            }
        }
    }

    lootTheRoom() {
        return this.currentPlayer;
    }

    lookForTrouble() {
        return this.currentPlayer;
    }

    charity() {
        if (this.currentPlayer.cardsInHand.length > this.currentPlayer.maxCardsOnHand) {
            this.currentPlayer.cardsInHand.splice(0, this.currentPlayer.maxCardsOnHand)
        }
    }
}