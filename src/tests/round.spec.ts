import {
    Board, Player, PlayerAI, BoardEvent} from "../common";
import { ElfRace } from "../cards/races";



describe('Round events', () => {
    const board = new Board();
    const firstPlayer = new Player({name: 'Player1'});
    const secondPlayer = new PlayerAI();

    board.deck = [

        new ElfRace()
    ];

    board.players = [
        firstPlayer,
        secondPlayer
    ];

    beforeAll(() => {
        board.startGame();
    })

    test('start round', () => {
        const handler = jest.fn();
        board.onChange.subscribe(handler);
        board.nextRound();

        expect(handler).toBeCalledWith(BoardEvent.ROUND_STARTED, expect.any(Player));
    })

    // test('finished', () => {
    //     const handler = jest.fn();
    //     board.onChange
    //         .filter(e => e === BoardEvent.ROUND_FINISHED)
    //         .subscribe(handler);

    //     board.phase.action();
    //     board.phase.action();

    //     expect(handler).toBeCalledWith(BoardEvent.ROUND_FINISHED);
    // })
})