import { Board, Player, PlayerAI, BoardEvent } from "../common";
import { PixelMonster, BugMonster, RockCurse } from "../cards";

describe('Board', () => {
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

    test('require players', () => {
        const b = new Board();
        expect(() => {
            b.startGame()
        }).toThrowError();
    });
    

    test('roll dice range', () => {
        let result;
        for (let i = 5; i--; ) {
            result = board.rollDice();
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(6);
        }
    })


})