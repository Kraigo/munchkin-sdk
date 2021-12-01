import { Phase } from "../common";
import { BaseEvent } from "./base.event";

export class NextPhaseEvent implements BaseEvent {
    constructor(
        public phase: Phase
    ) {}
}