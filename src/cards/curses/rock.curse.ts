import { Curse } from "../../common/curse";
import { Player } from "../../common/player";
import { Item, Equipment } from "../../common/item";
import { Board } from "../../common/board";

export class RockCurse extends Curse implements Curse {
    name = 'Rock for barefoot';

    effect(player: Player, board: Board): void {
        const card = player.cardsInPlay
            .filter(c => c instanceof Item)
            .map(c => <Item>c)
            .filter(c => c.equiped)
            .find(c => c.equipFor === Equipment.FOOT);

        if (card) {
            board.dropCard(card, player.cardsInPlay);
        }
    }
}