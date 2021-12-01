import { Card, Player } from "../common";
import { BaseEvent } from "./base.event";

export class RoundStartedEvent implements BaseEvent {
    constructor(
        public player: Player
    ) {}
}