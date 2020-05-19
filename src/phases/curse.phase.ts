import { Phase } from "../common/phase";
import { Curse } from "../common";

export class CursePhase extends Phase {
    
    action() {
        this.board.play
            .filter(card => card instanceof Curse)
            .forEach(card => {
                this.board.curse(this.board.currentPlayer, <Curse>card);
            });
        this.finished = true;
    }

    canPlayCard() {
        return true;
    }
}