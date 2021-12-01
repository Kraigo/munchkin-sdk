import { Phase } from "./phase";
import { CardDeck, Monster, Curse, Choice } from "../common";
import { CombatPhase } from "./combat.phase";
import { CursePhase } from "./curse.phase";
import { OtherCardPhase } from "./other-card.phase";

export class KickDoorPhase extends Phase {

    choice = Choice.create()
        .add({
            action: Choice.actions.KICK_DOOR,
            handle: () => {
                const card = this.board.openDeck(CardDeck.DOOR)
                const player = this.board.currentPlayer;
                
                if (card instanceof Monster) {
                    const combat = this.board.fight(player, card);
                    this.board.setPhase(new CombatPhase(this.board, combat));
                }
                else if (card instanceof Curse) {
                    this.board.setPhase(new CursePhase(this.board));
                }
                else {
                    this.board.setPhase(new OtherCardPhase(this.board, card));
                }
            }
        })
}