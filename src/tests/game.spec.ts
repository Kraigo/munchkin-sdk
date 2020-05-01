import {
    Board, Player, PlayerAI, BoardEvent,
    CardDeck, Monster, Curse
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

        board.nextTurn();
        
        expect(handler).toBeCalledWith(BoardEvent.NEXT_TURN, firstPlayer);
    });

    test('turn doesn\'t finished', () => {
        expect(board.currentTurn.finished).toBe(false);
        expect(() => {
            board.nextTurn();
        }).toThrowError();
    });

    describe('Phase 1', () => {        
        const cardsInDeck = board.deck.length;
        const handler = jest.fn();
        board.onChange.subscribe(handler);

        test('Kick Open The Door', () => {
            expect(board.currentTurn.phase).toBe(0);
            expect(board.currentTurn.combat).toBeUndefined();
            board.currentTurn.next();
            expect(handler).toBeCalledWith(BoardEvent.NEXT_PHASE);
            expect(board.currentTurn.phase).toBe(1);
        });

        test('card from deck played', () => {
            expect(board.deck.length).toBe(cardsInDeck - 1);
            expect(board.play.length).toBe(1);
        });

        test('played card from Doors deck', () => {
            const card = board.play[0];
            expect(card.deck).toBe(CardDeck.DOOR);            
        });

        afterAll(() => {
            const card = board.play[0];
            switch (true) {
                case card instanceof Monster: {
                    describe('opened card was Monster', () => {
                        expect(board.currentTurn.combat).toBeDefined();
                        expect(board.currentTurn.combat.playerSide.length).toBe(1);
                        expect(board.currentTurn.combat.monsterSide.length).toBe(1);
                    });
                    break;
                }

                case card instanceof Curse: {
                    describe('opened card was Curse', () => {
                        expect(board.currentTurn.combat).toBeUndefined();
                    });
                    break;
                }

                default: {
                    describe('no effects. you should take this card', () => {
                        expect(card instanceof Monster).toBeFalsy();
                        expect(card instanceof Curse).toBeFalsy();
                    });
                    break;
                }
            }
        })
    })

    describe('Phase 2', () => {
        const handler = jest.fn();
        board.onChange.subscribe(handler);

        test("Look For Trouble", () => {
            expect(true).toBe(true);
        });
        test("Look For Trouble", () => {
            expect(true).toBe(true);
        });
    })

    test('combat', () => {
        expect(true).toBe(true);
    });

})