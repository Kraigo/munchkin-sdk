import { RockCurse } from "./curses";
import { BugMonster, PixelMonster } from "./monsters";
import { ElfRace } from "./races";
import { BombShot } from "./shots";

export type BoardCard = PixelMonster
    | BugMonster
    | RockCurse
    | BombShot
    | ElfRace;