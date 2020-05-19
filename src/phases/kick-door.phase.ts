import { Phase } from "../common/phase";
import { CardDeck, Monster, Curse } from "../common";
import { CombatPhase } from "./combat.phase";
import { CursePhase } from "./curse.phase";
import { OtherCardPhase } from "./other-card.phase";

export class KickDoorPhase extends Phase {

    // onAction = new Emitter<Card>()

    action() {
        const card = this.board.openDeck(CardDeck.DOOR)
        const player = this.board.currentPlayer;

        switch (true) {
            case card instanceof Monster: {
                this.board.setPhase(new CombatPhase(this.board));
                break;
            }
            case card instanceof Curse: {
                this.board.setPhase(new CursePhase(this.board));
                break;
            }
            default: {
                this.board.setPhase(new OtherCardPhase(this.board, card));
                break;
            }
        }
        this.finished = true;
    }

    canOpenDoor() {
        return true;
    }
}