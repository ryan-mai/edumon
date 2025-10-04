function setBattle(worldState) {
    add([sprite('battle-background'), scale(1.3), pos(0, 0), 'background']);

    const enemyMon = add([sprite(worldState.enemyName + '-mon'), scale(5), pos(1300, 100), opacity(1), {fainted: false}]);
    enemyMon.flipX = true;

    tween(enemyMon.pos.x, 1000, 0.3, (val) => enemyMon.pos.x = val, easings.easeInSine);

    const playerMon = add([sprite('mushroom-mon'), scale(8), pos(-100, 300), opacity(1), {fainted: false}]);
    
    tween(playerMon.pos.x, 300, 0.3, (val) => playerMon.pos.x = val, easings.easeInSine);

    const playerMonHealthBox = add([rect(400, 100), outline(4), pos(1000, 400)]);

    playerMonHealthBox.add([text('MUSHY', {size: 32}), color(10, 10, 10), pos(10, 10)]);
    
    playerMonHealthBox.add([rect(370, 10), color(0, 200, 0), pos(15, 50)]);
    
    const playerMonHealthBar = playerMonHealthBox.add([rect(370, 10), color(200, 200, 200), pos(15, 50)]);

    tween(playerMonHealthBox.pos.x, 850, 0.3, (val) => playerMonHealthBox.pos.x = val, easings.easeInSine);

    const enemyMonHealthBox = add([rect(400, 100), outline(4), pos(850, 50)]);

    enemyMonHealthBox.add([text(`${(worldState.enemyName).toUpperCase()}MON`, {size: 32}), color(10, 10, 10), pos(10, 10)]);

    enemyMonHealthBox.add([rect(370, 10), color(0, 200, 0), pos(15, 50)]);

    const enemyMonHealthBar = enemyMonHealthBox.add([rect(370, 10), color(200, 200, 200), pos(15, 50)]);
    
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
}