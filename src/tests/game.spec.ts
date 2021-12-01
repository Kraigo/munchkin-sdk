import {
    Board, Player, PlayerAI, Phase
} from "../common";
import * as events from '../events';
import { PixelMonster } from "../cards/monsters/pixel.monster";
import { BugMonster } from "../cards/monsters/bug.monster";
import { RockCurse } from "../cards/curses/rock.curse";

describe('Game', () => {
    const board = new Board();
    const firstPlayer = new Player({name: 'Player1'});
    const secondPlayer = new PlayerAI();

    board.deck = [        
        new PixelMonster(),
        new BugMonster(),

        new RockCurse()
    ];

    board.players = [
        firstPlayer,
        secondPlayer
    ];
    
    test('start game', () => {       

        const handler = jest.fn();
        board.onChange
            .filter(e => e instanceof events.StartGameEvent)
            .subscribe(handler);

        board.startGame()

        expect(handler).toBeCalled();
    });

    test('select first player', () => {
        const handler = jest.fn();
        board.onChange
            .filter(e => e instanceof events.NextPhaseEvent)
            .subscribe(handler);

        board.nextRound();
        
        expect(handler).toBeCalled();
    });

})