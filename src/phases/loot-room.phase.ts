import { Phase } from "../common/phase";
import { Choice, CardDeck } from "../common";

export class LootRoomPhase extends Phase {

    choice = Choice.create()
        .add({
            action: Choice.actions.DRAW_CARD,
            handle: () => {
                this.board.drawDeck(this.board.currentPlayer, CardDeck.DOOR);
                this.board.finishRound();
            }
        })
}