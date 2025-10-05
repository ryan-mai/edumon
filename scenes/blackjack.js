function setBlackjack(worldState) {
    add([sprite('battle-background'), scale(1.3), pos(0, 0), 'background']);

    let coins = worldState.playerCoins;
    let attack = worldState.attack;
    
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['club', 'diamond', 'heart', 'spade'];
    const deck = shuffleDeck(createDeck());
    const playerHand = [];
    const dealerHand = [];

    dealCards(deck, playerHand, dealerHand);
    debug.log(`Player: ${playerHand} | Dealer: ${dealerHand}`)

    for (let i = 0; i < playerHand.length; i++) {
        debug.log(i)
        add([sprite('cards', {anim: playerHand[i]}), scale(2.5), pos(550 + i * 150, 500)]);
        if (i == 1) {
            add([sprite('cards', {anim: 'face-down'}), scale(2.5), pos(550 + i * 150, 200)]);
        } else {
            add([sprite('cards', {anim: dealerHand[i]}), scale(2.5), pos(550, 200)]);
        }
    }

   
    let phase = 'player-turn'

    const menuOptions = ['Hit', 'Stand'];
    let menuActive = false;
    let selectedMenu = 0;
    
    const box = add([rect(1300, 300), outline(4), pos(-2, 530)]);
    const content = box.add([text('Let\'s go gambling!', {size: 32}, {lineSpacing: 8}), color(10, 10, 10), pos(20, 20)])

    function renderMenu() {
        return menuOptions
            .map((option, idx) => (idx === selectedMenu ? `> ${option}` : ` ${option}`))
            .join('\n');
    }
    onKeyPress('w', () => {
        if (!menuActive) return
        selectedMenu = (selectedMenu - 1 + menuOptions.length) % menuOptions.length;
        content.text = renderMenu();
    });
    onKeyPress('s', () => {
        if (!menuActive) return
        selectedMenu = (selectedMenu + 1 + menuOptions.length) % menuOptions.length;
        content.text = renderMenu();
    });


    onKeyPress('space', () => {
        if ((calculateHandTotal(playerHand) >= 21) || (calculateHandTotal(dealerHand) >= 21)) return;

        if (phase === 'player-turn') {
            if (!menuActive) {
                menuActive = true;
                selectedMenu = 0;
                content.text = renderMenu();
                return;
            }

            const choice = menuOptions[selectedMenu];
            menuActive = false;
            content.text = `You ${choice.toLowerCase()}...`;

            if (choice === 'Hit') {
                hit(deck, playerHand);
                add([sprite('cards', {anim: playerHand[-1]}), scale(2.5), pos(550 + playerHand.length * 150, 200)]);
                content.text = `Your hand is ${calculateHandTotal(playerHand)}`;
            } else {
                stand(deck, playerHand);
                content.text = `Your final hand is ${calculateHandTotal(playerHand)}`;
                phase = 'dealer-turn';
            }
            return;
        }

        if (phase === 'dealer-turn') {
            let dealerTotal = calculateHandTotal(dealerHand);
            if (dealerTotal < 17) {
                hit(deck, dealerHand);
            }

            if (choice === 'hit') {
                add([sprite('cards', {anim: dealerHand[-1]}), scale(2.5), pos(550 + dealerHand.length * 150, 200)]);
                content.text = 'The dealer hit!';
            } else {
                content.text = 'The dealer stands!';
                phase = 'determine-winner';
            }
        }

        if (phase === 'determine-winner') {
            winner = determineWinner(playerHand, dealerHand);
            
            if (winner === 'l' || winner === 't') {
                attack = 0;
            }
            go('battle');
        }
    });

    function createDeck() {
        const deck = [];
        for (const value of values) {
            for (const suit of suits) {
                deck.push(`${value}-${suit}`);
            }
        }
        return deck
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]]
        }
        return deck
    }

    function dealCards(deck, playerHand, dealerHand) {
        for (let i = 0; i < 2; i++) {
            playerHand.push(deck.pop());
            dealerHand.push(deck.pop());
        }
    }

    function calculateHandTotal(hand) {
        let sum = 0
        for (let num = 0; num < hand.length; num++) {
            sum += hand[num];
        }
        return sum;
    }

    function hit(deck, playerHand) {
        playerHand.push(deck.pop());
        const total = calculateHandTotal(playerHand);
        if (total > 21) {
            stand(deck, playerHand);
        }
    }

    function stand(deck, hand) {
        while (calculateHandTotal(hand) < 17) {
            hand.push(deck.pop());
        }
    }

    function determineWinner(playerHand, dealerHand) {
        playerTotal = calculateHandTotal(playerHand);
        dealerTotal = calculateHandTotal(dealerHand);
        if (playerTotal > 21) {
            return l;
        } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
            return w;
        } else if (playerTotal < dealerTotal) {
            return l;
        } else {
            return t;
        }
    }
}