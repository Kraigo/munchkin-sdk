export enum ChoiceAction {
    COMBAT_RUN,
    COMBAT_WIN
}
export interface ChoiceOption {
    action: ChoiceAction
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