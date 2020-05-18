import { CardType } from "../../common";

export class UIFormatter {
    public static cardTypeName(t: CardType) {
        switch(t) {
            case CardType.MONSTER: return 'Monster';
            case CardType.CURSE: return 'Curse';
            case CardType.ITEM: return 'Item';
            case CardType.ONE_SHOT: return 'One-shot';
            default: return 'Card'
        }
    }
}