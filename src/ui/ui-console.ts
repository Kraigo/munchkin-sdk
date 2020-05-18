import { Board, BoardEvent } from "../common/board";
import { UILogger, UIMessage, UIFormatter } from "./core";
import { createInterface, Interface } from 'readline'
import { Player, CardType, Card } from "../common";

enum UIPlayerChoice {
    KICK_THE_DOOR = '1'
}

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
        switch(event) {
            case BoardEvent.START_GAME: {
                const message = 'Lets start the game. Press enter';
                this.ui.message(message, this.onStartGame.bind(this));
                break;
            }
            case BoardEvent.NEXT_TURN: {
                const player = this.board.currentPlayer;
                console.log(`Current Player: ${this.board.currentPlayer.name}`);

                if (player instanceof Player) {
                    const message = `Make a choice:\n`
                        + `${UIPlayerChoice.KICK_THE_DOOR} - Kick the door`;

                    this.ui.choice(UIPlayerChoice, message, this.onPlayChoice.bind(this))
                }
                break;
            }
            case BoardEvent.NEXT_PHASE: {
                // const player = this.board.currentPlayer;
                console.log("Card in game: ")
                this.board.play.forEach((card) => {
                    console.log(`-- ${card.name} [${UIFormatter.cardTypeName(card.cardType)}]`)
                })

                const player = this.board.currentPlayer;
                console.log("You Cards: ")
                player.cardsInHand.forEach((card) => {
                    console.log(`-- ${card.name}  [${UIFormatter.cardTypeName(card.cardType)}]`)
                })

                // this.ui.choice()
                break;
            }
        }
    }

    onPlayChoice(choice: UIPlayerChoice) {
        switch(choice) {
            case UIPlayerChoice.KICK_THE_DOOR: {
                const turn = this.board.currentTurn;
                turn.next();
                break;
            }

            default:
                break;
        }
    }

    onStartGame() {        
        this.board.nextTurn();
    }
}