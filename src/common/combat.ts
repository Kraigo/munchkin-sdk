import { Monster } from "./monster";
import { Player, PlayerEvent } from "./player";
import { Card } from "./card";
import { Shot } from "./shot";
import { Choice, ChoiceAction } from "./choice";

export class Combat {
    public players: Player[] = [];
    public playerSide: Card[] = [];
    public monsterSide: Card[] = [];

    constructor(player: Player, monster: Monster) {   
        this.players.push(player);
        this.monsterSide.push(<Card>monster);
        
        // this.fireChoices();      
    }

    playPlayerSide(card: Card) {
        this.playerSide.push(card);
        // this.fireChoices(); 
    }
    playMonsterSide(card: Card) {
        this.monsterSide.push(card);
        // this.fireChoices();
    }

    // fireChoices() {
    //     this.players.forEach(player => {
    //         const choice = new Choice();

    //         if (this.canPlayersWin) {
    //             choice.add({
    //                 action: ChoiceAction.COMBAT_WIN,
    //                 handle: () => {
    //                     console.log("NOT_IMPLEMENTED")
    //                 }
    //             })
    //         } else {
    //             choice.add({
    //                 action: ChoiceAction.COMBAT_RUN,
    //                 handle: () => {
    //                     console.log("NOT_IMPLEMENTED")
    //                 }
    //             })
    //         }

    //         player.onChoice.fire(PlayerEvent.COMBAT, choice);
    //     })
    // }

    get canPlayersWin() {
        return this.playerSideCombatPower >= this.monsterSideCombatPower;
    }

    get playerSideCombatPower() {
        let power = 0;

        for (const player of this.players) {
            // const playerStrength = this.monsterSide
                // .reduce((sum, monster) => (sum + monster.combatStrength()), 0)
                // TODO: CALCULATE MONSTER WEEKNESSES AND PLAYER WEEKNESSES
            power += player.level;
            power += player.bonuses;
        }

        for (const card of this.playerSide) {
            if (card instanceof Monster) {
                power += card.level;
            }
            else if (card instanceof Shot) {
                power += card.bonus;
            }
        }

        return power;
    }

    get monsterSideCombatPower() {
        let power = 0;

        for (const card of this.monsterSide) {
            if (card instanceof Monster) {
                power += card.level;
            }
            else if (card instanceof Shot) {
                power += card.bonus;
            }

        }
        
        return power;
    }
    get rewardLevels(): number {
        return this.monsterSide
            .filter(card => card instanceof Monster)
            .reduce((acc, curr: Monster) => acc + curr.rewardLevels, 0)
    }
    
    get rewardTreasures(): number {
        return this.monsterSide
            .filter(card => card instanceof Monster)
            .reduce((acc, curr: Monster) => acc + curr.rewardTreasures, 0)
    }
}