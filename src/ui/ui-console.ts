import { Board } from "../common/board";
import { UILogger, UIMessage, UIFormatter } from "./core";
import { createInterface, Interface } from 'readline'
import { ChoiceAction } from "../common";
import * as events from "../events";
import { BoardEvent } from "../events";
// import { Player, CardType, Card } from "../common";

export class UIConsole {

    private logger: UILogger;
    private interface: Interface;
    private ui: UIMessage;

    constructor(
        private board: Board
    ) {
        this.logger = new UILogger(board);

        this.board.onChange.subscribe(this.onBoardChange.bind(this));

        this.interface = createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });

        this.ui = new UIMessage(this.interface);
    }

    onBoardChange(event: BoardEvent) {
        switch(true) {
            case event instanceof events.StartGameEvent: {

                const message = 'Lets start the game. Press enter';
                this.ui.message(message, this.onStartGame.bind(this));
                break;
            }
            case event instanceof events.NextPhaseEvent: {

                this.ui.choice(this.board.phase.choice, 'Choice?', this.onPlayChoice.bind(this));
                break;
            }

            case event instanceof events.RoundFinishedEvent: {
                const message = 'Round finished';
                this.ui.message(message, this.onStartGame.bind(this));
                break;
            }
        }
    }

    dbg() {        
        console.log("Cards in game: ")
        this.board.cardsInPlay.forEach((card) => {
            console.log(`-- ${card.name} [${UIFormatter.cardTypeName(card)}]`)
        })

        const player = this.board.currentPlayer;
        console.log("Your Cards: ")
        player.cardsInHand.forEach((card) => {
            console.log(`-- ${card.name}  [${UIFormatter.cardTypeName(card)}]`)
        })
    }

    onPlayChoice(choice: ChoiceAction) {
        this.board.phase.action(choice);
    }

    onStartGame() {        
        this.board.nextRound();
    }
}