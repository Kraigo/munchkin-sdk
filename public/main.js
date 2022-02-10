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

    const {
        Board,
        Player,
        PlayerAI
    } = MunchSDK;
    const board = new Board();

    board.cardsInDeck = MunchSDK.cards;
    const me = new Player({
        name: 'Player1'
    })

    board.players = [
        me,
        new PlayerAI()
    ]


    board.onChange.subscribe(onBoardChange);
    board.onChange.subscribe((event, options) => {
        // History
        console.log(getEventName(event), options);
        const li = document.createElement('li');
        li.innerText = getEventName(event);
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
            addCards($playerHandCards, player.cardsInHand, (card) => {
                board.playCard(player, card);
            });
            addCards($playerPlayCards, player.cardsInPlay);

            $playerCurrent.innerHTML = `${player.name} ${player.level} (+${player.bonuses}), Race: ${MunchSDK.Races[player.race]}`
        }
    });

    board.startGame();


    function onBoardChange(event, params) {
        const {
            ChoiceAction
        } = MunchSDK;
        $phase.innerText = getEventName(event);

        switch (true) {
            case event instanceof MunchSDK.events.StartGameEvent: {

                $message.innerText = 'Lets start the game. Press enter';
                $actions.innerHTML = '';
                addAction('Start', () => {
                    board.nextRound();
                })
                break;
            }
            case event instanceof MunchSDK.events.NextPhaseEvent: {
                $message.innerText = 'Choice?';
                $actions.innerHTML = '';
                for (let opt of event.phase.choice.options) {
                    addAction(ChoiceAction[opt.action], () => {
                        opt.handle(opt.action)
                    })
                }

                // this.ui.choice(this.board.phase.choice, 'Choice?', this.onPlayChoice.bind(this));
                break;
            }

            case event instanceof MunchSDK.events.RoundFinishedEvent: {
                $message.innerText = 'Round finished';
                $actions.innerHTML = '';
                addAction('Next Round', () => {
                    board.nextRound();
                })
                break;
            }

            case event instanceof MunchSDK.events.CardPlayedEvent: {
                // playCard(event.card);
                break;
            }
        }
    }

    function getEventName(event) {
        switch (true) {
            case event instanceof MunchSDK.events.StartGameEvent:
                return 'Start Game';
            case event instanceof MunchSDK.events.CardPlayedEvent:
                return 'Card Played';
            case event instanceof MunchSDK.events.NextPhaseEvent:
                return 'Next Phase';
            case event instanceof MunchSDK.events.RollDiceEvent:
                return 'Roll Dice';
            case event instanceof MunchSDK.events.RoundFinishedEvent:
                return 'Round Finished';
            case event instanceof MunchSDK.events.RoundStartedEvent:
                return 'Round Started';
        }
    }

    function addAction(text, callback) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.addEventListener('click', callback);
        $actions.appendChild(btn);
    }

    function getCardNode(card) {

        const div = document.createElement('div');
        div.classList.add('card');
        div.classList.add(`card-deck-${card.deck}`);

        switch (true) {
            case card instanceof MunchSDK.Monster: {
                div.innerHTML += `<div class="card-level">Level ${card.level}</div>`;
                div.innerHTML += `<div class="card-name">${card.name}</div>`;
                div.innerHTML += `<div class="card-reward-treasures">${card.rewardTreasures} Treasures</div>`;
                div.innerHTML += `<div class="card-reward-levels">${card.rewardLevels} Levels</div>`;
                break;
            }
            case card instanceof MunchSDK.Curse: {
                div.innerHTML += `<div class="card-level">Curse!</div>`;
                div.innerHTML += `<div class="card-name">${card.name}</div>`;
                break;
            }

            default: {
                div.innerHTML += `<div class="card-name">${card.name}</div>`;
                break;
            }

        }
        return div;
    }

    function addCards($target, cards, callback) {
        $target.innerHTML = '';
        for (let card of cards) {
            const cardElm = getCardNode(card);
            cardElm.addEventListener('click', () => {
                if (typeof callback === 'function') {
                    callback(card)
                }
            });
            $target.appendChild(cardElm)
        }
    }
})