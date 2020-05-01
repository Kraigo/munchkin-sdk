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
        
        this.log(`Board Event : ${eventName}`);
    }

    onPlayChoice(event: PlayerEvent) {
        const eventName = PlayerEvent[event];

        this.log(`Player Event : ${eventName}`);        
    }

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