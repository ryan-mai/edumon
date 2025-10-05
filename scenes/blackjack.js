function setBlackjack(worldState) {
    add([sprite('battle-background'), scale(1.3), pos(0, 0), 'background']);

    let coins = worldState.playerCoins
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
            stand(deck, dealerHand);
        }
    }

    function stand(deck, dealerHand) {
        while (calculateHandTotal(dealerHand) < 17) {
            dealerHand.push(deck.pop());
        }

        determineWinner(playerHand, dealerHand);
    }

    function determineWinner(playerHand, dealerHand) {
        playerTotal = calculateHandTotal(playerHand);
        dealerTotal = calculateHandTotal(dealerHand);
        if (playerTotal > 21) {
            debug.log('You lost...');
        } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
            debug.log('You win!');
        } else if (playerTotal < dealerTotal) {
            debug.log('The dealer won...');
        } else {
            debug.log('Push');
        }
    }
}