import { Phase } from "../common/phase";
import { Board, Card } from "../common";
import { LootRoomPhase } from "./loot-room.phase";
import { LookTroublePhase } from "./look-trouble.phase";

enum RoomSearchPhaseActions {
    LOOT,
    TROUBLE
}

export class RoomSearchPhase extends Phase {

    actions = RoomSearchPhaseActions;

    action() {
        const action: any = null

        switch (action) {
            case RoomSearchPhaseActions.LOOT: {
                this.board.setPhase(new LootRoomPhase(this.board));
                break;
            }
            case RoomSearchPhaseActions.TROUBLE: {
                this.board.setPhase(new LookTroublePhase(this.board));
                break;
            }
        }
    }
}