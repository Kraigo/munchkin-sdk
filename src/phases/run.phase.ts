import { Phase } from "../common/phase";
import { Choice } from "../common";

export class RunPhase extends Phase {
    choice = Choice.create()
        .add({
            action: Choice.actions.ROLL_DICE,
            handle: () => {
                const result = this.board.rollDice();

                // TODO: CAN RUN!

                if (result < 5) {
                    
                }
                this.board.finishRound();
            }
        })
}