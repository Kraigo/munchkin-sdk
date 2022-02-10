import { Phase } from "./phase";
import { Choice, CardDeck } from "../common";

export class LootRoomPhase extends Phase {

    choice = Choice.create()
        .add({
            action: Choice.actions.DRAW_CARD,
            handle: () => {
                const player = this.board.currentPlayer;
                const card = this.board.getCardFromDeck(CardDeck.DOOR);
                this.board.takeCard(card, player);

                this.board.finishRound();
            }
        })
}