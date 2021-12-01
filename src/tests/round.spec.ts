import {
    Board, Player, PlayerAI, ChoiceAction} from "../common";
import { ElfRace } from "../cards/races";
import * as events from '../events';



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
        board.onChange
            .filter(e => e instanceof events.RoundStartedEvent)
            .subscribe(handler);
        board.nextRound();

        expect(handler).toBeCalled();
    })

    test('finished', () => {
        const handler = jest.fn();
        board.onChange
            .filter(e => e instanceof events.RoundFinishedEvent)
            .subscribe(handler);

        board.phase.action(ChoiceAction.KICK_DOOR);
        board.phase.action(ChoiceAction.DRAW_CARD);
        board.phase.action(ChoiceAction.LOOT_ROOM);
        board.phase.action(ChoiceAction.DRAW_CARD);

        expect(handler).toBeCalled();
    })
})