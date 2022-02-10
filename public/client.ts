import { Board, Card, Player, PlayerAI, ChoiceAction, Races, Monster, Curse, Shot } from '../src/common'
import { cards } from '../src/cards';
import * as events from '../src/events';
import { BoardEvent, CardPlayedEvent, NextPhaseEvent, RollDiceEvent, RoundStartedEvent, StartGameEvent } from '../src/events';
import { BombShot } from '../src/cards/shots/bomb.shot';

document.addEventListener('DOMContentLoaded', function() {
    const $message = document.getElementById('js-message');
    const $actions = document.getElementById('js-actions');
    const $phase = document.getElementById('js-phase');
    const $history = document.getElementById('js-history');
    const $boardPlayCards = document.getElementById('js-board-play-card');
    const $boadDeckCards = document.getElementById('js-board-deck-card');
    const $boardPlayDiscard = document.getElementById('js-board-discard-card');
    const $playerPlayCards = document.getElementById('js-player-play-card');
    const $playerHandCards = document.getElementById('js-player-hand-card');
    const $playerCurrent = document.getElementById('js-player-current');
    const $playerActions = document.getElementById('js-player-actions');
    const $combat = document.getElementById('js-combat');

    const board = new Board({shuffle: false});

    board.cardsInDeck = cards;
    const me = new Player({
        name: 'Player1'
    })

    board.players = [
        me,
        new PlayerAI()
    ]

    board.takeCard(
        cards.find(c => c instanceof BombShot),
        me
    );


    board.onChange.subscribe(onBoardChange);
    board.onChange.subscribe((event, options) => {
        // History
        const li = document.createElement('li');
        const name = event.constructor.name;

            
        if (event instanceof RollDiceEvent) {
            li.innerText = `Rolled dice ${event.result}`
        }
        else if(event instanceof RoundStartedEvent) {
            li.innerText = `Start ${event.player.name}`;
        }
        else if(event instanceof CardPlayedEvent) {
            li.innerHTML = `Card Player <i>${event.card.name}</i>`;
        }
        else if(event instanceof NextPhaseEvent) {
            li.innerHTML = `Next Phase <i>${event.phase.constructor.name}</i>`;
        }
        else {
            li.innerText = name;
        }
        $history.appendChild(li);
    });


    board.onChange.subscribe((event, options) => {
        // Players
        const $players = document.getElementById('js-players');
        $players.innerHTML = '';
        for (let player of board.players) {
            const el = document.createElement('div');

            el.innerText = `${player.name} [${player.level}] + ${player.bonuses}`;
            $players.appendChild(el);
        }
    });

    board.onChange.subscribe((event, options) => {
        addCards($boardPlayCards, board.cardsInPlay);
        addCards($boardPlayDiscard, board.cardsInDiscard);
        
        $boadDeckCards.innerHTML = '<i>Doors:</i> <br>'
            + board.deckDoors.map(c => `${c.name}`).join(', ')
            + '<br>'
            + '<i>Treasures:</i> <br>'
            + board.deckTreasures.map(c => `${c.name}`).join(', ');

        if (board.currentPlayer) {
            const player = board.currentPlayer;
            addCards($playerHandCards, player.cardsInHand, {
                onClick: (card) => {
                    board.playCard(player, card);
                }
            });
            addCards($playerPlayCards, player.cardsInPlay, {
                onMonsterSide: (card) => {
                    board.playCardMonsterSide(player, card)
                },
                onPlayerSide: (card) => {
                    board.playCardPlayerSide(player, card)
                }
            });

            $playerCurrent.innerHTML = [
                `Name: ${player.name}`,
                `Level: ${player.level} +${player.bonuses} (total ${player.level + player.bonuses})`,
                `Race: ${Races[player.race]}`
            ].join('<br>');
        }

        if (board.combat) {
            const combat = board.combat;
            $combat.innerHTML = [
                `Player (${combat.playerSideCombatPower}) vs Monster (${combat.monsterSideCombatPower})`,
                `Win ${combat.canPlayersWin ? 'Player' : 'Monster'}`
            ].join(', ')
        }
    });

    board.startGame();


    function onBoardChange(event: BoardEvent, params: any) {
        $phase.innerText = event.constructor.name;

        if (event instanceof events.StartGameEvent) {
            $message.innerText = 'Lets start the game. Press enter';
            $actions.innerHTML = '';
            board.nextRound();
        }
        else if (event instanceof events.NextPhaseEvent) {
            $message.innerText = 'Choice?';
            $actions.innerHTML = '';
            for (let opt of event.phase.choice.options) {
                addAction(ChoiceAction[opt.action], opt.handle);
            }
        }
        else if (event instanceof events.RoundFinishedEvent) {
            $message.innerText = 'Round finished';
            $actions.innerHTML = '';
            addAction('Next Round', () => {
                board.nextRound();
            })
        }
    }

    function addAction(text: string, callback: () => void) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.addEventListener('click', callback);
        $actions.appendChild(btn);
    }

    function getCardNode(card: Card) {
        const div = document.createElement('div');
        div.classList.add('card');
        div.classList.add(`card-deck-${card.deck}`);
        if (card instanceof Monster) {
            div.innerHTML += `<div class="card-level">Level ${card.level}</div>`
                + `<div class="card-name">${card.name}</div>`
                + `<div class="card-reward-treasures">${card.rewardTreasures} Treasures</div>`
                + `<div class="card-reward-levels">${card.rewardLevels} Levels</div>`;
        } else if (card instanceof Curse) {
            div.innerHTML += `<div class="card-level">Curse!</div>`
                + `<div class="card-name">${card.name}</div>`;
        } else if (card instanceof Shot) {
            div.innerHTML += `<div class="card-level">+${card.bonus} Bonus</div>`
                + `<div class="card-name">${card.name}</div>`;
        } else {
            div.innerHTML += `<div class="card-name">${card.name}</div>`;
        }
        div.innerHTML += '<div class="card-actions">'
            + '<button class="js-play">Play</button>'
            + '<button class="js-monster-side">Monster side</button>'
            + '<button class="js-player-side">Player side</button>'
            + '</div>';
            
        return div;
    }

    function addCards($target: HTMLElement, cards: Card[], options?: {
        onClick?: (card: Card) => void,
        onMonsterSide?: (card: Card) => void,
        onPlayerSide?: (card: Card) => void
    }) {
        $target.innerHTML = '';
        for (let card of cards) {
            const cardElm = getCardNode(card);

            const actions = [{
                selector: '.js-play',
                callback: options?.onClick
            }, {
                selector: '.js-monster-side',
                callback: options?.onMonsterSide
            }, {
                selector: '.js-player-side',
                callback: options?.onPlayerSide
            }]

            for (let action of actions) {
                const elm: HTMLElement = cardElm.querySelector(action.selector);
                if (typeof action.callback === 'function') {
                    elm.addEventListener('click', (e) => {
                        e.stopPropagation();
                        action.callback(card);
                    });
                }
                else {
                    elm.style.display = 'none';
                }
            }

            $target.appendChild(cardElm)
        }
    }
})