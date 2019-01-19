import { Monster } from "./monster";
import { Player } from "./player";
import { Card } from "./card";
import { Shot } from "./shot";

export class Combat {
    public players: Player[] = [];
    public playerSide: Card[] = [];
    public monsterSide: Card[] = [];

    constructor(player: Player, monster: Monster) {   
        this.players.push(player);
        this.monsterSide.push(<Card>monster);  
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
}