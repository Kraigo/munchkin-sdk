import { Phase } from "../common/phase";
import { Board } from "../common";

export class CombatPhase extends Phase {

    canPlayCard() {
        return true;
    }

    canRun() {
        return true;
    }
}