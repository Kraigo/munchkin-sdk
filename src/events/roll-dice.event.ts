import { Card } from "../common";
import { BaseEvent } from "./base.event";

export class RollDiceEvent implements BaseEvent {
    constructor(
        public result: number
    ) {}
}