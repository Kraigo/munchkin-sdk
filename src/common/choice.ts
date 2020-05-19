export enum ChoiceAction {
    COMBAT_RUN,
    COMBAT_WIN,
    LOOK_TROUBLE,
    LOOT_ROOM,
    KICK_DOOR,
    DRAW_CARD,
    ROLL_DICE,
    APPLY_CARD
}
export interface ChoiceOption {
    // title: string;
    action: ChoiceAction;
    handle: () => void;
}

export class Choice {

    static actions = ChoiceAction;

    constructor() {
    }

    public options: ChoiceOption[] = [];

    public add(option: ChoiceOption) {
        this.options.push(option);
        return this;
    }

    public trigger(action: ChoiceAction) {
        const option = this.options.find(o => o.action === action);

        if (option) {
            return option.handle();
        }
    }

    public static create() {
        return new Choice();
    }
}