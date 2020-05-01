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
                this.createQuestion(
                    'Lets start the game. Press enter',                    
                    () => {
                        this.board.nextTurn();
                        return true
                    }
                )
                break;
            }
            case BoardEvent.NEXT_TURN: {
                const player = this.board.currentPlayer;
                console.log(`Current Player: ${this.board.currentPlayer.name}`);

                if (player instanceof Player) {
                    this.createQuestion(
                        `Make a choice:\n`
                        + `${UIPlayerChoice.KICK_THE_DOOR} - Kick the door`,
                        this.onPlayChoice
                    )
                }
                break;
            }
        }
        // console.log('Board changed', event);
    }

    onPlayChoice(choice: UIPlayerChoice) {
        switch(choice) {
            case UIPlayerChoice.KICK_THE_DOOR: {
                console.log('Kicked');
                return true;
            }

            default:
                return false;
        }
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