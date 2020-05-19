import {
    Board, Player, PlayerAI, BoardEvent, ChoiceAction} from "../common";
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

    test('finished', () => {
        const handler = jest.fn();
        board.onChange
            .filter(e => e === BoardEvent.ROUND_FINISHED)
            .subscribe(handler);

        board.phase.action(ChoiceAction.KICK_DOOR);
        board.phase.action(ChoiceAction.DRAW_CARD);
        board.phase.action(ChoiceAction.LOOT_ROOM);
        board.phase.action(ChoiceAction.DRAW_CARD);

        expect(handler).toBeCalledWith(BoardEvent.ROUND_FINISHED);
    })
})