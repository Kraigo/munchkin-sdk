import { Player, PlayerEvent, Combat, Choice, ChoiceAction } from "../common";
import { PixelMonster } from "../cards/monsters/pixel.monster";
import { BombShot } from '../cards/shots/bomb.shot';

describe("Combat", () => {
    const player = new Player();
    const monster = new PixelMonster();
    const shotCard = new BombShot();


    describe('Init combat', () => {
        const handler = jest.fn();
        player.onChoice.subscribe(handler);
        const combat = new Combat(player, monster);

        test('combat started', () => {
            expect(handler).toBeCalled();
            expect(handler.mock.calls[0][0]).toBe(PlayerEvent.COMBAT);
        })

        test('combat started with 2 sides', () => {
            expect(combat.monsterSide.length).toBe(1);
            expect(combat.players.length).toBe(1);
        });
    
        test('each side has combat strength', () => {
            expect(combat.playerSideCombatStrength).toBeGreaterThan(0);        
            expect(combat.monsterSideCombatStrength).toBeGreaterThan(0);
        });

    })

    describe("Win battle", () => {

        const combat = new Combat(player, monster);
        const handler = jest.fn();
        player.onChoice.subscribe(handler);

        test('play card for player side', () => {
            expect(combat.playerSide.length).toBe(0);
            combat.playPlayerSide(shotCard);
            expect(combat.playerSide.length).toBe(1);
        })

        test('player should win', () => {    
            expect(combat.playerSideCombatStrength).toBeGreaterThan(combat.monsterSideCombatStrength);
        });
        
        test('player has choices to win', () => {
            expect(handler).toBeCalledTimes(2);

            const event: PlayerEvent = handler.mock.calls[1][0];
            const choice: Choice = handler.mock.calls[1][1];
            
            expect(event).toBe(PlayerEvent.COMBAT);
            expect(choice instanceof Choice).toBeTruthy();
            expect(choice.options.length).toBe(1);
            expect(choice.options[0].action).toBe(ChoiceAction.COMBAT_WIN);
        });
    });

    describe("Run combat", () => {

        const combat = new Combat(player, monster);
        const handler = jest.fn();
        player.onChoice.subscribe(handler);

        test('player can\'t win', () => {    
            expect(combat.playerSideCombatStrength).toBeLessThanOrEqual(combat.monsterSideCombatStrength);
        });
        
        test('player has choices to run', () => {
            expect(handler).toBeCalled();

            const event: PlayerEvent = handler.mock.calls[0][0];
            const choice: Choice = handler.mock.calls[0][1];
            
            expect(event).toBe(PlayerEvent.COMBAT);
            expect(choice instanceof Choice).toBeTruthy();
            expect(choice.options.length).toBe(1);
            expect(choice.options[0].action).toBe(ChoiceAction.COMBAT_WIN);
        });
    });
})