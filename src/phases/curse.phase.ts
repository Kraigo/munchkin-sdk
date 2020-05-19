import { Phase } from "../common/phase";
import { Choice, Curse } from "../common";

export class CursePhase extends Phase {
    
    choice = Choice.create()
        .add({
            action: Choice.actions.APPLY_CARD,
            handle: () => {
                this.board.play
                    .filter(card => card instanceof Curse)
                    .forEach(card => {
                        this.board.curse(this.board.currentPlayer, <Curse>card);
                    });

                this.board.finishRound();
            }
        })
}