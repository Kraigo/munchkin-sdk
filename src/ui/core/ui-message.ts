import { Interface } from "readline";
import { Choice, ChoiceAction } from "../../common";

export class UIMessage {
    constructor(
        private _interface: Interface
    ) {

    }

    choice(choice: Choice, question: string, callback: (result: ChoiceAction) => any) {

        question += '\n';
        question += choice.options
            .map((c, i) => `${i + 1} - ${ChoiceAction[c.action]}`)
            .join('\n');

        this.createQuestion(question, (result) => {
            const option = choice.options[Number(result) - 1];
            if (option) {
                callback(option.action);
                return true;
            } else {
                return false;
            }
        })
    }

    message(question: string, callback: (result: string) => any) {
        this.createQuestion(question, (result) => {
            callback(result);
            return true;
        });
    }

    private createQuestion(question: string, callback: (result: string) => boolean) {
        this._interface.question(question + "\n", (result) => {
            const finished = callback(result);
            if (!finished) {
                this.createQuestion.apply(this, Array.from(arguments));
            };
        });
    }
}