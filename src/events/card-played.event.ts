import { Card } from "../common";
import { BaseEvent } from "./base.event";

export class CardPlayedEvent implements BaseEvent {
    constructor(
        public card: Card
    ) {}
}