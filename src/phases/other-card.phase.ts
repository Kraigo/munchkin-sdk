import { Phase } from "../common/phase";
import { Board, Card } from "../common";
import { RoomSearchPhase } from "./room-search.phase";

export class OtherCardPhase extends Phase {

    constructor(board: Board, private card: Card) {
        super(board);
    }

    action() {
        const player = this.board.currentPlayer;
        this.board.takeCard(this.card, player.cardsInHand);
        this.board.setPhase(new RoomSearchPhase(this.board));

        // this.board.finishRound();
    }
}