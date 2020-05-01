import { Board } from "../common/board";

export class UIConsole {

    constructor(
        private board: Board
    ) {
        this.board.onChange.subscribe(this.onBoardChange.bind(this));
    }

    onBoardChange() {
        console.log('Board changed');
    }
}