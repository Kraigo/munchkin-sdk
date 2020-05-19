import { Card, Monster, Curse, Item, Shot, Phase, Race } from "../../common";
import { KickDoorPhase, OtherCardPhase, CombatPhase, LookTroublePhase, RoomSearchPhase, LootRoomPhase } from "../../phases";

export class UIFormatter {
    public static cardTypeName(card: Card) {
        switch(true) {
            case card instanceof Monster: return 'Monster';
            case card instanceof Curse: return 'Curse';
            case card instanceof Item: return 'Item';
            case card instanceof Shot: return 'One-shot';
            case card instanceof Race: return 'Race';
            default: return 'Card'
        }
    }

    public static phaseName(phase: Phase) {
        switch(true) {
            case phase instanceof KickDoorPhase: return 'Kick the door';
            case phase instanceof OtherCardPhase: return 'Other card';
            case phase instanceof CombatPhase: return 'Combat';
            case phase instanceof LookTroublePhase: return 'Looking for Troubles';
            case phase instanceof LootRoomPhase: return 'Look the room';
            case phase instanceof RoomSearchPhase: return 'Search the room';
            default: return phase.constructor.name
        }
    }

    public static diceResult(result: number) {
        switch (result) {
            case 1: return '1 ⚀';
            case 2: return '2 ⚁';
            case 3: return '3 ⚂';
            case 4: return '4 ⚃';
            case 5: return '5 ⚄';
            case 6: return '6 ⚅';
        }
    }
}