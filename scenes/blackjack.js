function setBlackjack(worldState) {
    add([sprite('battle-background'), scale(1.3), pos(0, 0), 'background']);

    let coins = worldState.playerCoins || 0;
    let attack = worldState.attack || 0;

    const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    const suits = ['club','diamond','heart','spade'];
    const deck = shuffleDeck(createDeck());
    const playerHand = [];
    const dealerHand = [];

    dealInitial();

    const playerCardSprites = [];
    const dealerCardSprites = [];

    let phase = 'player-turn';
    const menuOptions = ['Hit','Stand'];
    let menuActive = false;
    let selectedMenu = 0;

    const box = add([rect(1300, 300), outline(4), pos(-2, 530)]);
    const content = box.add([text("Let's go gambling!", { size: 32, lineSpacing: 8 }), color(10,10,10), pos(20,20)]);

    renderHands(true);

    function createDeck() {
        const d = [];
        for (const v of values) for (const s of suits) d.push(`${v}-${s}`);
        return d;
    }

    function shuffleDeck(d) {
        for (let i = d.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [d[i], d[j]] = [d[j], d[i]];
        }
        return d;
    }

    function dealInitial() {
        for (let i = 0; i < 2; i++) {
            playerHand.push(deck.pop());
            dealerHand.push(deck.pop());
        }
        debug.log(`Player: ${playerHand} | Dealer: ${dealerHand}`);
    }

    function getCardValue(card) {
        const rank = card.split('-')[0];
        if (rank === 'A') return 11;
        if (['K','Q','J'].includes(rank)) return 10;
        return Number(rank);
    }

    function calculateHandTotal(hand) {
        let sum = 0;
        let aces = 0;
        for (const card of hand) {
            const v = getCardValue(card);
            sum += v;
            if (v === 11) aces++;
        }
        while (sum > 21 && aces > 0) {
            sum -= 10;
            aces--;
        }
        return sum;
    }

    function renderHands(hideDealerSecond = false) {
        playerCardSprites.forEach(c => destroy(c));
        dealerCardSprites.forEach(c => destroy(c));
        playerCardSprites.length = 0;
        dealerCardSprites.length = 0;

        playerHand.forEach((card, i) => {
            playerCardSprites.push(add([sprite('cards', { anim: card }), scale(3.5), pos(115 + i * 135, 250 + i * 10)]));
        });
        dealerHand.forEach((card, i) => {
            let anim = (i === 1 && hideDealerSecond) ? 'face-down' : card;
            dealerCardSprites.push(add([sprite('cards', { anim }), scale(2.5), pos(875 + i * 75, 135 + i * 10)]));
        });
    }

    function addPlayerCard() {
        const i = playerHand.length - 1;
        const card = playerHand[i];
        const obj = add([sprite('cards', { anim: card }), scale(3.5), pos(115 + i * 135, 250 + i * 10)]);
        playerCardSprites.push(obj);
    }

    function addDealerCard(reveal = true) {
        const i = dealerHand.length - 1;
        const card = dealerHand[i];
        const anim = reveal ? card : 'face-down';
        const obj = add([sprite('cards', { anim }), scale(2.5), pos(875 + i * 75, 135 + i * 10)]);
        dealerCardSprites.push(obj);
    }

    function playerHit() {
        if (phase !== 'player-turn') return;
        playerHand.push(deck.pop());
        addPlayerCard();
        const total = calculateHandTotal(playerHand);
        content.text = `You drew. Total: ${total}`;
        if (total >= 21) {
            phase = 'dealer-turn';
            startDealerTurn();
        }
    }

    function startDealerTurn() {
        if (phase !== 'dealer-turn') return;
        renderHands(false);
        const loopDealer = () => {
            const dealerTotal = calculateHandTotal(dealerHand);
            if (dealerTotal < 17) {
                dealerHand.push(deck.pop());
                addDealerCard(true);
                wait(0.4, loopDealer);
            } else {
                phase = 'determine-winner';
                finishGame();
            }
        };
        loopDealer();
    }

    function finishGame() {
        const result = determineWinner(playerHand, dealerHand);
        let msg;
        if (result === 'w') {
            msg = 'You win! Well, you get to attack then!';
        } else if (result === 'l') {
            msg = 'You lose. Better luck next time!';
            attack = 0;
        } else {
            msg = 'Push. The house always wins! :)';
            attack = 0;
        }
        content.text = `${msg} (You ${calculateHandTotal(playerHand)} vs Dealer ${calculateHandTotal(dealerHand)})`;
        wait(1.2, () => {
            worldState.attack = attack;
            worldState.phase = 'player-turn';
            worldState.returnFromBlackjack = true;
            worldState.coins = coins;
            go('battle', worldState);
        });
    }

    function determineWinner(pHand, dHand) {
        const p = calculateHandTotal(pHand);
        const d = calculateHandTotal(dHand);
        if (p > 21) return 'l';
        if (d > 21) return 'w';
        if (p > d) return 'w';
        if (p < d) return 'l';
        return 't';
    }

    function handleStand() {
        if (phase !== 'player-turn') return;
        phase = 'dealer-turn';
        startDealerTurn();
    }

    function renderMenu() {
        return menuOptions.map((opt, i) => (i === selectedMenu ? `> ${opt}` : `  ${opt}`)).join('\n');
    }

    onKeyPress('w', () => {
        if (!menuActive || phase !== 'player-turn') return;
        selectedMenu = (selectedMenu - 1 + menuOptions.length) % menuOptions.length;
        content.text = renderMenu();
    });

    onKeyPress('s', () => {
        if (!menuActive || phase !== 'player-turn') return;
        selectedMenu = (selectedMenu + 1) % menuOptions.length;
        content.text = renderMenu();
    });

    onKeyPress('space', () => {
        if (phase === 'player-turn') {
            if (!menuActive) {
                menuActive = true;
                selectedMenu = 0;
                content.text = renderMenu();
                return;
            }
            const choice = menuOptions[selectedMenu];
            menuActive = false;
            if (choice === 'Hit') playerHit();
            else handleStand();
        }
    });
}