import { Board, Player, PlayerAI, BoardEvent } from "../common";
import { PixelMonster } from "../cards/monsters/pixel.monster";
import { BugMonster } from "../cards/monsters/bug.monster";
import { RockCurse } from "../cards/curses/rock.curse";

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

    test('rool dice event', () => {        
        const handler = jest.fn();
        board.onChange
            .filter(e => e === BoardEvent.ROLL_DICE)
            .subscribe(handler);

        board.rollDice();
        board.rollDice();

        expect(handler).toBeCalledTimes(2);
    })

    test('next player', () => {
        const b = new Board(); 
        b.players = [
            firstPlayer,
            secondPlayer
        ];
        expect(b.currentPlayer).toBeUndefined();
        b.startGame();
        b.nextRound();
        expect(b.currentPlayer).toBe(firstPlayer);
        b.nextRound();
        expect(b.currentPlayer).toBe(secondPlayer);
        b.nextRound();
        expect(b.currentPlayer).toBe(firstPlayer);
    })

    
    test('roll dice random', () => {
        const randomNumbers = Array.from({ length: 10 }, () => board.rollDice());
        const allSame = randomNumbers.every(n => n === randomNumbers[0]);
        expect(allSame).toBeFalsy();
    })


})