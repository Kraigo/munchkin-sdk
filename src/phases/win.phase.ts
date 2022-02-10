import { Phase } from "./phase";
import { Board, CardDeck, Choice, Combat } from "../common";

/**
 * After combat you can win.
 * You get treasures and levelr from monsters
 */
export class WinPhase extends Phase {
    choice = Choice.create()
        .add({
            action: Choice.actions.COLLECT_REWARDS,
            handle: () => {
                const firstPlayer = this.combat.players[0];
                const treasuresCount = this.combat.rewardTreasures;
                const levelsCount = this.combat.rewardLevels;

                for (let i = treasuresCount; i > 0; i--) {
                    const card = this.board.getCardFromDeck(CardDeck.TREASURE);
                    this.board.takeDoorCard(card, firstPlayer.cardsInHand);
                }

                firstPlayer.gotUpLevel(levelsCount);

                this.board.finishRound();
            }
        })
    
    constructor(board: Board, private combat: Combat) {
        super(board);
    }
}