import { Player, PlayerOptions } from "./player";

export class PlayerAI extends Player {

    constructor(options?: PlayerOptions) {
        super(options);
        this.name = this.generateName();
        Object.assign(this, options);
    }

    generateName() {
        return 'bot-' + Math.ceil(Math.random() * 10000);
    }
}