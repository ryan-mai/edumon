function setBattle(worldState) {
    add([sprite('battle-background'), scale(1.3), pos(0, 0), 'background']);
    
    let phase = worldState.phase || 'player-selection'
    let attack = worldState.attack || 0;

    const enemyMon = add([sprite(worldState.enemyName + '-mon'), scale(5), pos(1300, 100), opacity(1), {fainted: false}]);
    enemyMon.flipX = true;

    tween(enemyMon.pos.x, 1000, 0.3, (val) => enemyMon.pos.x = val, easings.easeInSine);

    const playerMon = add([sprite('mushroom-mon'), scale(8), pos(-100, 300), opacity(1), {fainted: false}]);
    
    tween(playerMon.pos.x, 300, 0.3, (val) => playerMon.pos.x = val, easings.easeInSine);

    const playerMonHealthBox = add([rect(400, 100), outline(4), pos(1000, 400)]);

    playerMonHealthBox.add([text('MUSHY', {size: 32}), color(10, 10, 10), pos(10, 10)]);
    
    playerMonHealthBox.add([rect(370, 10), color(200, 200, 200), pos(15, 50)]);
    
    const playerMonHealthBar = playerMonHealthBox.add([rect(370, 10), color(0, 200, 0), pos(15, 50)]);
    playerMonHealthBar.width = worldState.playerHP || 370;

    tween(playerMonHealthBox.pos.x, 850, 0.3, (val) => playerMonHealthBox.pos.x = val, easings.easeInSine);


    const enemyMonHealthBox = add([rect(400, 100), outline(4), pos(850, 50)]);

    enemyMonHealthBox.add([text(`${(worldState.enemyName).toUpperCase()}MON`, {size: 32}), color(10, 10, 10), pos(10, 10)]);

    enemyMonHealthBox.add([rect(370, 10), color(200, 200, 200), pos(15, 50)]);

    const enemyMonHealthBar = enemyMonHealthBox.add([rect(370, 10), color(0, 200, 0), pos(15, 50)]);
    enemyMonHealthBar.width = worldState.enemyHP || 370;

    tween(enemyMonHealthBox.pos.x, 100, 0.3, (val) => enemyMonHealthBox.pos.x = val, easings.easeInSine);

    if (worldState.playerHP !== undefined) playerMonHealthBar.width = worldState.playerHP;
    if (worldState.enemyHP !== undefined) enemyMonHealthBar.width = worldState.enemyHP; // fixed bug
    
    let pendingReturnedAttack = false;
    if (worldState.returnFromBlackjack || worldState.returnFromDino) {
        pendingReturnedAttack = true;
        worldState.returnFromBlackjack = false;
        worldState.returnFromDino = false;
    }

    let playerCoins = worldState.playerCoins || 0;

    const coinsLabel = add([
        text(playerCoins, {size: 48}),
        pos(1165, 24),
        color(255, 215, 0),
        fixed(),
    ]);

    const coinsIcon = add([
        sprite('coin'),
        pos(1155 + 48, 24),
        fixed(),
        scale(0.04),
    ])

    const box = add([rect(1300, 300), outline(4), pos(-2, 530)]);
    const content = box.add([text('', {size: 32}, {lineSpacing: 8}), color(10, 10, 10), pos(20, 20)])

    // tween(box.pos.y, 530, 0.3, (val) => box.pos.y = val, easings.easeInSine);

    if (worldState.returnFromBlackjack) {
        content.text = 'Well, then let\'s continue! (Space)';
    } else {
        content.text = 'MUSHY is fired up to attack!';
    }

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
        );
    }

    function getRandomIntInclusive(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
    }

    let menuOptions = ['Dino', 'Blackjack', 'More Coming Soon...'];
    if (playerCoins >= 3) {
        if (!menuOptions.includes('Tackle')) menuOptions.push('Tackle');
    } else {
        if (menuOptions.length > 3) {
            menuOptions.pop();
        }
    }
    let menuActive = false;
    let selectedMenu = 0;
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

    function flashScreen() {
        const flash = add([rect(1280, 720), color(10, 10, 10), fixed(), opacity(0)]);
        tween(flash.opacity, 1, 0.5, (val) => flash.opacity = val, easings.easeInBounce);
    }

    function startBlackjack(damageDealt) {
        worldState.enemyHP = enemyMonHealthBar.width;
        worldState.playerHP = playerMonHealthBar.width;
        worldState.phase = 'player-turn';
        worldState.attack = damageDealt;
        worldState.playerCoins = playerCoins;
        worldState.returnFromBlackjack = false;
        flashScreen();
        setTimeout(() => {
            go('blackjack', worldState);
        }, 500);
    }

    function startDino() {
        worldState.enemyHP = enemyMonHealthBar.width;
        worldState.playerHP = playerMonHealthBar.width;
        worldState.phase = 'player-turn';
        worldState.playerCoins = playerCoins;
        worldState.returnFromDino = false;
        worldState.attack = 0;
        flashScreen();
        setTimeout(() => {
            go('dino', worldState);
        }, 500);
    }

    function handlePlayerAttack() {
        const dmg = (typeof attack === 'number' && attack !== 0) ? attack : (worldState.attack || 0);
        if (dmg > 100) {
            content.text = `It's a critical hit! ${dmg.toFixed(0)} damage!`;
        } else {
            content.text = `${dmg.toFixed(0)} damage!`;
        }

        if (enemyMonHealthBar.width - dmg > 400) {
            content.text = `${(worldState.enemyName).toUpperCase()}MON thanks you for healing them!`;
            tween(
                enemyMonHealthBar.width,
                370,
                0.5,
                (val) => enemyMonHealthBar.width = val, easings.easeInSine
            );
        } else {
            reduceHealth(enemyMonHealthBar, dmg);
        }
        damageEffect(enemyMon);
        worldState.attack = 0;
        attack = 0;
        phase = 'enemy-turn';
    }
    
    onKeyPress('space', () => {
        if (playerMon.fainted || enemyMon.fainted) return;

        if (pendingReturnedAttack && phase === 'player-selection') {
            pendingReturnedAttack = false;
            handlePlayerAttack();
            return;
        }

        if (phase === 'player-selection') {
            if (!menuActive) {
                menuActive = true;
                selectedMenu = 0;
                content.text = renderMenu();
                return;
            }

            const choice = menuOptions[selectedMenu];
            menuActive = false;
            // content.text = `Playing ${choice.toLowerCase()}...`;

            if (choice === 'Blackjack') {
                attack = getRandomIntInclusive(0, 150);
                worldState.attack = attack;
                startBlackjack(attack);
                return;
            } else if (choice === 'Dino') {
                startDino();
                return;
            } else if (choice === 'Tackle') {
                attack = getRandomIntInclusive(50, 250);
                coins -= 3;
                phase = 'player-turn';

            } else {
                attack = getRandomIntInclusive(0, 150);
                worldState.attack = attack;
                startBlackjack(attack);
                return;
            }
            phase = 'player-turn';
            return;
        }
        
        if (phase === 'player-turn') {
            handlePlayerAttack();
            return;
        }

        if (phase === 'enemy-turn') {
            content.text = `${(worldState.enemyName).toUpperCase()}MON attacks!`;
            const attack = Math.random() * 100;
            if (attack > 67) {
                content.text = "It's a critical hit!";
            }
            reduceHealth(playerMonHealthBar, attack);
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
            }, 800);

            setTimeout(() => {
                worldState.faintedMons.push(worldState.enemyName);
                worldState.playerHP = 370;
                worldState.enemyHP = 370;
                go('world', worldState);
            }, 1600);
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
                worldState.enemyHP = 370;
                worldState.playerHP = 370;
                go('world', worldState);
            }, 1600);
        }
    });
}