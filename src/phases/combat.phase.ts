import { Phase } from "../common/phase";
import { Board, Choice } from "../common";
import { RunPhase } from "./run.phase";

export class CombatPhase extends Phase {
    choice = Choice.create()
        .add({
            action: Choice.actions.COMBAT_RUN,
            handle: () => {
                this.board.setPhase(new RunPhase(this.board));
            }
        })
}