export interface ChoiceOption {
    title: string;
    callback: Function;
}

export class Choice {
    public options: ChoiceOption[] = [];

    public add(option: ChoiceOption) {
        this.options.push(option);
        return this;
    } 

    public static create() {
        return new Choice();
    }
}