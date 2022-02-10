import { Board } from "../common/board";
import { Player } from "../common/player";
import { PlayerAI } from "../common/player-ai";

import { cards } from '../cards';
import { UIConsole } from ".";

(function main() {

    const board = new Board();
    const ui = new UIConsole(board);

    board.cardsInDeck = cards;

    board.players = [
        new Player({name: 'Player1'}),
        new PlayerAI()
    ]
    board.startGame();

})();