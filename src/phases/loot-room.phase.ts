import { Phase } from "../common/phase";

export class LootRoomPhase extends Phase {

    action() {
        this.board.finishRound();
    }
}