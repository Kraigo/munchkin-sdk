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
        
        this.fireChoices();      
    }

    playPlayerSide(card: Card) {
        this.playerSide.push(card);
        this.fireChoices(); 
    }
    playMonsterSide(card: Card) {
        this.monsterSide.push(card);
        this.fireChoices();
    }

    fireChoices() {
        this.players.forEach(player => {
            const choice = new Choice();

            if (this.canPlayersWin) {
                choice.add({
                    action: ChoiceAction.COMBAT_WIN,
                    handle: () => {
                        console.log("NOT_IMPLEMENTED")
                    }
                })
            } else {
                choice.add({
                    action: ChoiceAction.COMBAT_RUN,
                    handle: () => {
                        console.log("NOT_IMPLEMENTED")
                    }
                })
            }

            player.onChoice.fire(PlayerEvent.COMBAT, choice);
        })
    }

    get canPlayersWin() {
        return this.playerSideCombatStrength >= this.monsterSideCombatStrength;
    }

    get playerSideCombatStrength() {
        let combatStrength = 0;
        combatStrength += this.players.reduce((strength, player) => {    
            // const playerStrength = this.monsterSide
                // .reduce((sum, monster) => (sum + monster.combatStrength()), 0)
                // TODO: CALCULATE MONSTER WEEKNESSES AND PLAYER WEEKNESSES

            strength += player.level;
            strength += player.bonuses;
            return strength;
        }, 0);

        combatStrength += this.playerSide.reduce((strength, card) => {
            switch (true) {
                case card instanceof Shot: {
                    const shot = <Shot>card;
                    strength += shot.bonus;
                    break;
                }
                case card instanceof Monster: {
                    const monster = <Monster>card;
                    strength += monster.level;
                }
            }

            return strength;
        }, 0);

        return combatStrength;
    }

    get monsterSideCombatStrength() {
        return this.monsterSide
            .filter(c => c instanceof Monster)
            .map(c => <Monster>c)        
            .reduce((strength, monster) => {
                strength += monster.level;
                return strength;
            }, 0)
    }
    get rewardLevels(): number {
        return this.monsterSide
            .filter(card => card instanceof Monster)
            .reduce((acc, curr: Monster) => acc + curr.rewardLevels, 0)
    }
    
    get rewardTreasurs(): number {
        return this.monsterSide
            .filter(card => card instanceof Monster)
            .reduce((acc, curr: Monster) => acc + curr.rewardTreasurs, 0)
    }
}