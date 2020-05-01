import { Board, BoardEvent, PlayerEvent } from "../common";

export class UILogger {
    constructor(
        private board: Board
    ) {
        this.board.onChange.subscribe(this.onBoardChange.bind(this));

        for (let player of this.board.players) {
            player.onChoice.subscribe(this.onPlayChoice.bind(this));
        }
    }

    onBoardChange(event: BoardEvent) {
        const eventName = BoardEvent[event];
        
        console.log(`[${this.now}] Board Event : ${eventName}`);
    }

    onPlayChoice(event: PlayerEvent) {
        const eventName = PlayerEvent[event];

        console.log(`[${this.now}] Player Event : ${eventName}`);        
    }

    get now() {
        const date = new Date();
        const hours = String(date.getHours());
        const minutes = String(date.getMinutes()).padStart(2, '00');
        const seconds = String(date.getSeconds()).padStart(2, '00');
        return `${hours}:${minutes}:${seconds}`;
    }
}