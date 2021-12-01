import { Phase } from "./phase";
import { Board, Choice, Combat } from "../common";
import { RunPhase } from "./run.phase";
import { WinPhase } from "./win.phase";

export class CombatPhase extends Phase {
    choice = Choice.create()
        .add({
            action: Choice.actions.COMBAT_RUN,
            handle: () => {
                this.board.setPhase(new RunPhase(this.board));
            }
        })
        .add({
            action: Choice.actions.COMBAT_WIN,
            handle: () => {
                if (!this.board.combat.canPlayersWin) {
                    return this;
                }
                this.board.setPhase(new WinPhase(this.board, this.combat));
            }
        })

    constructor(board: Board, private combat: Combat) {
        super(board);
    }
}