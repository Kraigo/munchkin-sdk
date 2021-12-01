import { Board } from "../../common/board";
import { UIFormatter } from "./ui-formatter";
import * as events from "../../events";
import { BoardEvent } from "../../events";

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
        const eventName = event.constructor.name

        switch(true) {
            case event instanceof events.RoundStartedEvent: {
                this.log(`${eventName} : ${this.board.currentPlayer.name}`);
                break;
            }
            case event instanceof events.NextPhaseEvent: {
                this.log(`${eventName} : ${options.constructor.name}`);
                break;
            }
            case event instanceof events.CardPlayedEvent: {
                this.log(`${eventName} : ${options.name}`);
                break;
            }
            case event instanceof events.RollDiceEvent: {
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