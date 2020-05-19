import { Phase } from "../common/phase";
import { Board, Card, Choice } from "../common";
import { LootRoomPhase } from "./loot-room.phase";
import { LookTroublePhase } from "./look-trouble.phase";

enum RoomSearchPhaseActions {
    LOOT,
    TROUBLE
}

export class RoomSearchPhase extends Phase {

    actions = RoomSearchPhaseActions;

    choice = Choice.create()
        .add({
            action: Choice.actions.LOOK_TROUBLE,
            handle: () => {
                this.board.setPhase(new LookTroublePhase(this.board));
            }
        })
        .add({
            action: Choice.actions.LOOT_ROOM,
            handle: () => {
                this.board.setPhase(new LootRoomPhase(this.board));
            }
        })
}