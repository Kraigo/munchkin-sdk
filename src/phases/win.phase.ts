import { Phase } from "./phase";
import { Board, CardDeck, Choice, Combat } from "../common";

export class WinPhase extends Phase {
    choice = Choice.create()
        .add({
            action: Choice.actions.COLLECT_REWARDS,
            handle: () => {
                const firstPlayer = this.combat.players[0];

                console.log('rewardTreasurs', this.combat.rewardTreasurs);
                for (let i = this.combat.rewardTreasurs; i > 0; i--) {
                    const card = this.board.getCardFromDeck(CardDeck.TREASURE);
                    console.log('card', card);
                    this.board.takeCard(card, firstPlayer.cardsInHand);
                }

                firstPlayer.gotUpLevel(this.combat.rewardLevels);

                this.board.finishRound();
            }
        })
    
    constructor(board: Board, private combat: Combat) {
        super(board);
    }
}