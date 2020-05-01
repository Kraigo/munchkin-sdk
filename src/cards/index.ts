
import { Card } from "./../common";

/* Monsters */
import { PixelMonster } from "./monsters/pixel.monster";
import { BugMonster } from "./monsters/bug.monster";

/* Curses */
import { RockCurse } from "./curses/rock.curse";

/* Shots */
import { BombShot } from './shots/bomb.shot';

export const cards: Card[] = [
    new PixelMonster,
    new BugMonster,
    new RockCurse,
    new BombShot
]