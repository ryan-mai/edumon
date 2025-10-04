function setBattle(worldState) {
    add([sprite('battle-background'), scale(1.3), pos(0, 0), 'background']);

    const enemyMon = add([sprite(worldState.enemyName + '-mon'), scale(5), pos(1300, 100), opacity(1), {fainted: false}]);
    enemyMon.flipX = true;

    tween(enemyMon.pos.x, 1000, 0.3, (val) => enemyMon.pos.x = val, easings.easeInSine);

    const playerMon = add([sprite('mushroom-mon'), scale(8), pos(-100, 300), opacity(1), {fainted: false}]);
    
    tween(playerMon.pos.x, 300, 0.3, (val) => playerMon.pos.x = val, easings.easeInSine);

    const playerMonHealthBox = add([rect(400, 100), outline(4), pos(1000, 400)]);

    playerMonHealthBox.add([text('MUSHY', {size: 32}), color(10, 10, 10), pos(10, 10)]);
    
    playerMonHealthBox.add([rect(370, 10), color(200, 200, 200), pos(15, 50)]);
    
    const playerMonHealthBar = playerMonHealthBox.add([rect(370, 10), color(0, 200, 0), pos(15, 50)]);

    tween(playerMonHealthBox.pos.x, 850, 0.3, (val) => playerMonHealthBox.pos.x = val, easings.easeInSine);

    let playerCoins = worldState.coins;

    const enemyMonHealthBox = add([rect(400, 100), outline(4), pos(850, 50)]);

    enemyMonHealthBox.add([text(`${(worldState.enemyName).toUpperCase()}MON`, {size: 32}), color(10, 10, 10), pos(10, 10)]);

    enemyMonHealthBox.add([rect(370, 10), color(200, 200, 200), pos(15, 50)]);

    const enemyMonHealthBar = enemyMonHealthBox.add([rect(370, 10), color(0, 200, 0), pos(15, 50)]);
    
    tween(enemyMonHealthBox.pos.x, 100, 0.3, (val) => enemyMonHealthBox.pos.x = val, easings.easeInSine);

    const box = add([rect(1300, 300), outline(4), pos(-2, 530)]);
    const content = box.add([text('MUSHROOM is fired up to gamble!', {size: 42}), color(10, 10, 10), pos(20, 20)])

    // tween(box.pos.y, 530, 0.3, (val) => box.pos.y = val, easings.easeInSine);

    function reduceHealth(healthBar, damageDealt) {
        tween(
            healthBar.width,
            healthBar.width - damageDealt,
            0.5,
            (val) => healthBar.width = val, easings.easeInSine
        );
    }

    function damageEffect(mon) {
        tween(
            mon.opacity,
            0,
            0.3,
            (val) => {
                mon.opacity = val;
                if (mon.opacity === 0) {
                    mon.opacity = 1;
                }
            },
            easings.easeInBounce
        )
    }
    function getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
    }
    let phase = 'player-selection'
    let attack = 0;
    onKeyPress('space', () => {
        if (playerMon.fainted || enemyMon.fainted) return;
        
        if (phase === 'player-selection') {
            let cost = getRandomIntInclusive(0, 3);
            content.text = `> Tackle for ${cost} coins?`;
            if (playerCoins > cost) {
                attack = Math.random() * 150;
            } else {
                attack = getRandomIntInclusive(-250, 200);
                let debt = cost - playerCoins;
                content.text = `> Scratch for ${debt} coins?`;
            }
            phase = 'player-turn';
            return;
        }

        if (phase === 'player-turn') {
            content.text = `${attack}`;
            if (attack > 100) {
                content.text = "It's a critical hit!";
            }
            if (enemyMonHealthBar.width - attack > 400) {
                content.text = `${(worldState.enemyName).toUpperCase()}MON thanks you for the healing!`;
                tween(
                    enemyMonHealthBar.width,
                    370,
                    0.5,
                    (val) => enemyMonHealthBar.width = val, easings.easeInSine
                );
            } else {
                reduceHealth(enemyMonHealthBar, attack);
            }
            damageEffect(enemyMon);
            phase = 'enemy-turn';
            return;
        }

        if (phase === 'enemy-turn') {
            content.text = `${(worldState.enemyName).toUpperCase()}MON attacks!`;
            const Attack = Math.random() * 100;
            if (Attack > 67) {
                content.text = "It's a critical hit!";
            }
            reduceHealth(playerMonHealthBar, Attack);
            damageEffect(playerMon);
            phase = 'player-selection';
            return;
        }
    });

    function colorizeHealthbar(healthBar) {
        if (healthBar.width < 200) {
            healthBar.use(color(250, 150, 0));
        }

        if (healthBar.width < 100) {
            healthBar.use(color(200, 0, 0));
        }
    }

    function makeMonDrop(mon) {
        tween(
            mon.pos.y,
            800,
            0.5,
            (val) => mon.pos.y = val,
            easings.easeInSine,
        );
    }

    onUpdate(() => {
        colorizeHealthbar(playerMonHealthBar);
        colorizeHealthbar(enemyMonHealthBar);

        if (enemyMonHealthBar.width < 0 && !enemyMon.fainted) {
            makeMonDrop(enemyMon);
            content.text = `${(worldState.enemyName).toUpperCase()}MON has fainted!`
            enemyMon.fainted = true;

            setTimeout(() => {
                content.text = 'MUSHY has won the battle!';
            }, 1000);

            setTimeout(() => {
                worldState.faintedMons.push(worldState.enemyName);
                go('world', worldState);
            }, 2000);
        }
        else if (playerMonHealthBar.width < 0 && !playerMon.fainted) {
            makeMonDrop(playerMon);
            content.text = 'MUSHY has fainted!'
            playerMon.fainted = true;

            setTimeout(() => {
                content.text = 'Well, time for a reset!';
            }, 1000);

            setTimeout(() => {
                worldState.playerPos = vec2(500, 700);
                go('world', worldState);
            }, 2000);
        }
    });
}