import {
    Board, Player, PlayerAI, BoardEvent,
    CardDeck, Monster, Curse, Card, Phase, ChoiceAction
} from "../common";
import { PixelMonster, BugMonster } from "../cards/monsters";
import { RockCurse } from "../cards/curses";
import { BombShot } from "../cards/shots";
import { ElfRace } from "../cards/races";
import { KickDoorPhase, CombatPhase, CursePhase, OtherCardPhase, RoomSearchPhase } from "../phases";
import { Item } from "../common/item";

describe('Kick the Door phase', () => {
    const board = new Board();
    const firstPlayer = new Player({name: 'Player1'});
    const secondPlayer = new PlayerAI();

    board.deck = [        
        new PixelMonster(),
        new BugMonster(),

        new RockCurse(),

        new BombShot()
    ];

    board.players = [
        firstPlayer,
        secondPlayer
    ];
    
    
    test('start', () => {
        board.startGame();
        board.nextRound();

        expect(board.phase).toBeInstanceOf(KickDoorPhase);
    });

    // test('restricted', () => {
    // })

    // test('allowed', () => {
    // })

    // test('have actions', () => {
        
    // })

    test('play action', () => {
        const handler = jest.fn();
        board.onChange.subscribe(handler);
        expect(board.play.length).toBe(0);
        expect(board.phase.choice.options.length).toBe(1);

        board.phase.action(ChoiceAction.KICK_DOOR);
        
        expect(handler).toBeCalledWith(BoardEvent.CARD_PLAYED, expect.any(Card));
        expect(board.play.length).toBe(1);
    });

    // afterAll(() => {
    //     const card = board.play[0];
    //     switch (true) {
    //         case card instanceof Monster: {
    //             describe('monster over the door', () => {
    //                 expect(board.phase).toBeInstanceOf(CombatPhase);
    //             })
    //             break;               
    //         }

    //         case card instanceof Curse: {
    //             describe('curse over the door', () => {
    //                 expect(board.phase).toBeInstanceOf(CursePhase);
    //             });
    //             break;
    //         }
    //         case card instanceof Item: {
    //             describe('item over the door', () => {
    //                 expect(board.phase).toBeInstanceOf(KickDoorPhase);
    //                 expect(board.play.length).toBe(0);
    //                 expect(board.currentPlayer.cardsInHand).toContain(card);
    //             });
    //             break;
    //         }
    //     }
    // })
})

describe('Other Card phase', () => {
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
        board.nextRound();
        board.phase.action(ChoiceAction.KICK_DOOR);
    })

    test('played card is item', () => {
        const card = board.play[0];

        expect(card).not.toBeInstanceOf(Monster);
        expect(card).not.toBeInstanceOf(Curse);
        expect(board.play.length).toBe(1);

        expect(board.phase).toBeInstanceOf(OtherCardPhase);
    })

    test('Draw card', () => {
        const card = board.play[0];

        board.phase.action(ChoiceAction.DRAW_CARD);

        expect(board.play.length).toBe(0);
        expect(board.currentPlayer.cardsInHand).toContain(card);

    })
})

describe('Room Search phase', () => {
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
        board.nextRound();
        board.phase.action(ChoiceAction.KICK_DOOR);
        board.phase.action(ChoiceAction.DRAW_CARD);
    })

    test('corrent phase', () => {
        expect(board.phase).toBeInstanceOf(RoomSearchPhase)
    })

    test('should have choice', () => {

        expect(board.phase.choice.options.length).toBe(2);

        board.phase.action(ChoiceAction.LOOK_TROUBLE);
        

        // expect(board.canLoot()).toBeTruthy();
        // expect(board.canTrouble()).toBeTruthy();

        // const actions = this.board.phase.actions;
        // expect(board.phase.action())
    })
})