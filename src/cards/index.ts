
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

export const cards: Card[] = [
    new PixelMonster,
    new BugMonster,
    new RockCurse,
    new BombShot
]