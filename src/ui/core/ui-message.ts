import { Interface } from "readline";

export class UIMessage {
    constructor(
        private _interface: Interface
    ) {

    }

    choice(choice: {[key: string]: string}, question: string, callback: (result: string) => any) {
        this.createQuestion(question, (result) => {
            var values = Object.values(choice);                            
            if (values.includes(result)) {
                callback(result)
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