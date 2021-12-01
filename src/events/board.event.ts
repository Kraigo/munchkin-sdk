import { CardPlayedEvent } from "./card-played.event";
import { NextPhaseEvent } from "./next-phase.event";
import { RollDiceEvent } from "./roll-dice.event";
import { RoundFinishedEvent } from "./round-finished.event";
import { RoundStartedEvent } from "./round-started.event";
import { StartGameEvent } from "./start-game.event";

export type BoardEvent = StartGameEvent
    | CardPlayedEvent
    | NextPhaseEvent
    | RollDiceEvent
    | RoundFinishedEvent
    | RoundStartedEvent;