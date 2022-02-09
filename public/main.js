document.addEventListener('DOMContentLoaded', function() {
    const $message = document.getElementById('js-message');
    const $actions = document.getElementById('js-actions');
    const $phase = document.getElementById('js-phase');
    const $history = document.getElementById('js-history');
    const $boadPlayCards = document.getElementById('js-board-play-card');
    const $playerPlayCards = document.getElementById('js-player-play-card');
    const $playerHandCards = document.getElementById('js-player-hand-card');

    const {
        Board,
        Player,
        PlayerAI
    } = MunchSDK;
    const board = new Board();

    board.deck = MunchSDK.cards;

    board.players = [
        new Player({
            name: 'Player1'
        }),
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
        $boadPlayCards.innerHTML = '';
        for (let card of board.cardsInPlay) {
            $boadPlayCards.appendChild(getCardNode(card));
        }

        if (board.currentPlayer) {
            $playerHandCards.innerHTML = '';
            for (let card of board.currentPlayer.cardsInHand) {
                $playerHandCards.appendChild(getCardNode(card));
            }

            $playerPlayCards.innerHTML = '';
            for (let card of board.currentPlayer.cardsInPlay) {
                $playerHandCards.appendChild(getCardNode(card));
            }
        }
    });

    board.startGame();


    function onBoardChange(event, params) {
        const {
            ChoiceAction
        } = MunchSDK;
        $phase.innerText = getEventName(event);
        $actions.innerHTML = '';

        switch (true) {
            case event instanceof MunchSDK.events.StartGameEvent: {

                $message.innerText = 'Lets start the game. Press enter';
                addAction('Start', () => {
                    board.nextRound();
                })
                break;
            }
            case event instanceof MunchSDK.events.NextPhaseEvent: {
                $message.innerText = 'Choice?';
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
})