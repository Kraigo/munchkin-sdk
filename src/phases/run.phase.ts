import { Phase } from "./phase";
import { Choice, Monster } from "../common";

export class RunPhase extends Phase {
    choice = Choice.create()
        .add({
            action: Choice.actions.ROLL_DICE,
            handle: () => {
                const result = this.board.rollDice();
                const { combat } = this.board;

                // TODO: CAN RUN!

                if (result < 5) {
                    for (let card of combat.monsterSide) {
                        if (card instanceof Monster) {
                            for (const player of combat.players) {
                                card.penalty(player)
                            }
                        }
                    }
                }
                
                this.board.finishRound();
            }
        })
}