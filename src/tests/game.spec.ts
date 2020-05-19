import {
    Board, Player, PlayerAI, BoardEvent,
    CardDeck, Monster, Curse, Phase
} from "../common";
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
        board.onChange.subscribe(handler);

        board.startGame()

        expect(handler).toBeCalledWith(BoardEvent.START_GAME);
    });

    test('select first player', () => {
        const handler = jest.fn();
        board.onChange.subscribe(handler);

        board.nextRound();
        
        expect(handler).toBeCalledWith(BoardEvent.NEXT_PHASE, expect.any(Phase));
    });

})