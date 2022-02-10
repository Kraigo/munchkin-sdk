import { Board } from "./board";
import { Monster } from "./monster";
import { Player } from "./player";
import { Choice, ChoiceAction } from "./choice"
import { Curse } from "./curse";
import { CardDeck } from "./card";
import { Combat } from "./combat";
import { NextPhaseEvent } from "../events";

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
                            // title: 'Look for Trouble',
                            action: ChoiceAction.LOOK_TROUBLE,
                            handle: () => {
                                console.log("NOT_IMPLEMENTED")
                            }
                        })
                        .add({
                            // title: 'Loot the Room',
                            action: ChoiceAction.LOOT_ROOM,
                            handle: () => {
                                console.log("NOT_IMPLEMENTED")
                            }                
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

        this.board.onChange.fire(new NextPhaseEvent(null));
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
                this.board.takeDoorCard(card, this.player.cardsInHand);
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

    canRun() {
        return this.combat;
    }

    canKick() {
        return this.phase = 0;
    }

    run() {
        const dice = this.board.rollDice();
        return dice > 4;
    }
}