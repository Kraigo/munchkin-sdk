export enum ChoiceAction {
    COMBAT_RUN,
    COMBAT_WIN,
    LOOK_FOR_TROUBLE,
    LOOT_THE_ROOM
}
export interface ChoiceOption {
    // title: string;
    action: ChoiceAction;
}

export class Choice {

    constructor() {
    }

    public options: ChoiceOption[] = [];

    public add(option: ChoiceOption) {
        this.options.push(option);
        return this;
    } 

    public static create() {
        return new Choice();
    }
}