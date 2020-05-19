import { Board, BoardEvent } from "../../common/board";
import { UIFormatter } from "./ui-formatter";

export class UILogger {
    constructor(
        private board: Board
    ) {
        this.board.onChange.subscribe(this.onBoardChange.bind(this));

        // for (let player of this.board.players) {
        //     player.onChoice.subscribe(this.onPlayChoice.bind(this));
        // }
    }

    onBoardChange(event: BoardEvent, options: any) {
        const eventName = BoardEvent[event]; 

        switch(event) {
            case BoardEvent.ROUND_STARTED: {
                this.log(`${eventName} : ${this.board.currentPlayer.name}`);
                break;
            }
            case BoardEvent.NEXT_PHASE: {
                this.log(`${eventName} : ${options.constructor.name}`);
                break;
            }
            case BoardEvent.CARD_PLAYED: {
                this.log(`${eventName} : ${options.name}`);
                break;
            }
            case BoardEvent.ROLL_DICE: {
                this.log(`${eventName} : ${options}`);
                break;
            }
            default: {               
                this.log(`${eventName}`);
                break;
            }
        }
    }

    // onPlayChoice(event: PlayerEvent) {
    //     const eventName = PlayerEvent[event];

    //     this.log(`Player Event : ${eventName}`);        
    // }

    get now() {
        const date = new Date();
        const hours = String(date.getHours()).padStart(2, '00');
        const minutes = String(date.getMinutes()).padStart(2, '00');
        const seconds = String(date.getSeconds()).padStart(2, '00');
        return `${hours}:${minutes}:${seconds}`;
    }

    private log(msg: string) {
        console.log('\x1b[36m', `[${this.now}] ${msg}` ,'\x1b[0m');
    }
}