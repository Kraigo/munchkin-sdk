import { Board } from "./common/board";
import { Player } from "./common/player";
import { PlayerAI } from "./common/player-ai";

import cards from './cards/index';

(function main() {

    const board = new Board();

    board.deck = cards;

    board.players = [
        new Player({name: 'Player1'}),
        new PlayerAI()
    ]
    board.startGame();


})();