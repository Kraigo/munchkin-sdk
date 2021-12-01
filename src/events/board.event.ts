import { CardPlayedEvent } from "./card-played.event";
import { StartGameEvent } from "./start-game.event";

export type BoardEvent = StartGameEvent | CardPlayedEvent;