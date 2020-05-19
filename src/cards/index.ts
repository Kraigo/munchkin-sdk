
import { Card } from "./../common";

/* Monsters */
import {
    PixelMonster,
    BugMonster
} from "./monsters";

/* Curses */
import {
    RockCurse
} from "./curses";

/* Shots */
import {
    BombShot
} from './shots';

/* Races */
import {
    ElfRace
} from './races';

export const cards: Card[] = [
    new PixelMonster,
    new BugMonster,
    new RockCurse,
    new BombShot,
    new ElfRace
]