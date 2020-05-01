import { Board, BoardEvent } from "../common/board";
import { UILogger } from "./ui-logger";
import { createInterface, Interface } from 'readline'
import { Player } from "../common";

enum UIPlayerChoice {
    KICK_THE_DOOR = '1'
}

export class UIConsole {

    private logger: UILogger;
    private interface: Interface
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
    }

    onBoardChange(event: BoardEvent) {

        switch(event) {
            case BoardEvent.START_GAME: {
                const message = 'Lets start the game. Press enter'
                this.createMessage(message, this.onStartGame.bind(this));
                break;
            }
            case BoardEvent.NEXT_TURN: {
                const player = this.board.currentPlayer;
                console.log(`Current Player: ${this.board.currentPlayer.name}`);

                if (player instanceof Player) {
                    const message = `Make a choice:\n`
                        + `${UIPlayerChoice.KICK_THE_DOOR} - Kick the door`;

                    this.createChoice(UIPlayerChoice, message, this.onPlayChoice.bind(this))
                }
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

    createChoice(choice: {[key: string]: string}, question: string, callback: (result: string) => any) {
        this.createQuestion(question, (result) => {
            var values = Object.values(choice);                            
            if (values.includes(result)) {
                callback(result)
                return true;
            } else {
                return false;
            }
        })
    }

    createMessage(question: string, callback: (result: string) => any) {
        this.createQuestion(question, (result) => {
            callback(result);
            return true;
        });
    }

    createQuestion(question: string, callback: (result: string) => boolean) {
        this.interface.question(question + "\n", (result) => {
            const finished = callback(result);
            if (!finished) {
                this.createQuestion.apply(this, Array.from(arguments));
            };
        });

        // this.interface.on("close", function() {
        //     console.log("\nBYE BYE !!!");
        // });
    }
}