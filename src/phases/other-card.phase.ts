import { Phase } from "../common/phase";
import { Board, Card, Choice, ChoiceAction } from "../common";
import { RoomSearchPhase } from "./room-search.phase";

export class OtherCardPhase extends Phase {

    choice = Choice.create()
        .add({
            action: ChoiceAction.DRAW_CARD,
            handle: () => {
                const player = this.board.currentPlayer;
                this.board.takeCard(this.card, player.cardsInHand);
                this.board.setPhase(new RoomSearchPhase(this.board));
            }
        });

    constructor(board: Board, private card: Card) {
        super(board);
    }

}