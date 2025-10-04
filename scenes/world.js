function setWorld(worldState) {
    function makeTile(type) {
        return [sprite('tile'), {type}]
    }

    const map = [
        addLevel(
            [
                "                 ",
                " cdddddddddddde  ",
                " 30000000000002  ",
                " 30000000000002  ",
                " 30000000000002  ",
                " 30030000008889  ",
                " 30030000024445  ",
                " 300a8888897777  ",
                " 30064444457777  ",
                " 30000000000000  ",
                " 30000000021111  ",
                " 3000000002      ",
                " 1111111111      ",
                "      b          ",
                "     b      b    ",
                " b             b ",
            ],
            {
                tileWidth: 16,
                tileHeight: 16,
                tiles: {
                0: () => makeTile("grass-m"),
                1: () => makeTile("grass-water"),
                2: () => makeTile("grass-r"),
                3: () => makeTile("grass-l"),
                4: () => makeTile("ground-m"),
                5: () => makeTile("ground-r"),
                6: () => makeTile("ground-l"),
                7: () => makeTile("sand-1"),
                8: () => makeTile("grass-mb"),
                9: () => makeTile("grass-br"),
                a: () => makeTile("grass-bl"),
                b: () => makeTile("rock-water"),
                c: () => makeTile("grass-tl"),
                d: () => makeTile("grass-tm"),
                e: () => makeTile("grass-tr"),
                },
        }),
        addLevel(
        [
            "      12       ",
            "      34       ",
            " 000    00  12 ",
            " 00   00    34 ",
            " 0    0        ",
            "      0  0     ",
            "           5   ",
            "           6   ",
            "     5         ",
            "     6   0     ",
            "               ",
            "               ",
            "               ",
        ],
        {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
            0: () => makeTile(),
            1: () => makeTile("bigtree-pt1"),
            2: () => makeTile("bigtree-pt2"),
            3: () => makeTile("bigtree-pt3"),
            4: () => makeTile("bigtree-pt4"),
            5: () => makeTile("tree-t"),
            6: () => makeTile("tree-b"),
            },
        }),
        addLevel(
        [
            " 00000000000000 ",
            "0     11       0",
            "0           11 0",
            "0           11 0",
            "0              0",
            "0   2          0",
            "0   2      3333 ",
            "0   2      0   0",
            "0   3333333    0",
            "0    0         0",
            "0          0000 ",
            "0          0    ",
            " 0000000000     ",
            "                ",
        ],
        {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
            0: () => [
                area({ shape: new Rect(vec2(0), 16, 16) }),
                body({ isStatic: true }),
            ],
            1: () => [
                area({
                shape: new Rect(vec2(0), 8, 8),
                offset: vec2(4, 4),
                }),
                body({ isStatic: true }),
            ],
            2: () => [
                area({ shape: new Rect(vec2(0), 2, 16) }),
                body({ isStatic: true }),
            ],
            3: () => [
                area({
                shape: new Rect(vec2(0), 16, 20),
                offset: vec2(0, -4),
                }),
                body({ isStatic: true }),
            ],
            },
        }),
    ];

    for (const layer of map) {
        layer.use(scale(4));
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type);
            }
        }
    }

    add([sprite('mini-mons'), area(), body({isStatic: true}), pos(100, 700), scale(4), 'cat']);
    
    const spiderMon = add([sprite('mini-mons'), area(), body({isStatic: true}), pos(400, 300), scale(4), 'spider']);
    spiderMon.play('spider');
    spiderMon.flipX = true;

    const centipedeMon = add([sprite('mini-mons'), area(), body({isStatic: true}), pos(100, 100), scale(4), 'centipede']);
    centipedeMon.play('centipede');

    const grassMon = add([sprite('mini-mons'), area(), body({isStatic: true}), pos(900, 570), scale(4), 'grass']);
    grassMon.play('grass');
    
    const npc = add([sprite('npc'), area(), body({isStatic: true}), pos(600, 700), scale(4), 'npc']);

    const player = add([sprite('player-down'), pos(500, 700), scale(4), area(), body(),
        {currentSprite: 'player-down', speed: 300, isInDialogue: false}
    ]);

    const up_keys = ['up', 'w']
    const down_keys = ['down', 's']
    const left_keys = ['left', 'a']
    const right_keys = ['right', 'd']
    let tick = 0

    const keyDirMap = {
        up: 'up', w: 'up',
        down: 'down', s: 'down',
        left: 'left', a: 'left',
        right: 'right', d: 'right',
    }

    let activeDir = null;

    function setSprite(player, spriteName) {
        if (player.currentSprite !== spriteName) {
            player.use(sprite(spriteName))
            player.currentSprite = spriteName
        }
    }
    
    onUpdate(() => {
        camPos(player.pos)
        tick++
        const isMoving = activeDir !== null;
        if (isMoving && tick % 20 === 0 && !player.isInDialogue) {
            player.flipX = !player.flipX
        }

        if (!player.isInDialogue && activeDir) {
            if (activeDir === 'up') {
                setSprite(player, 'player-up');
                player.move(0, -player.speed);
            } else if (activeDir === 'down') {
                setSprite(player, 'player-down')
                player.move(0, player.speed);
            } else if (activeDir === 'left' || activeDir === 'right') {
                player.flipX = (activeDir === 'right');
                if (player.curAnim() !== 'walk') {
                    setSprite(player, 'player-side');
                    player.play('walk');
                }
                player.move(activeDir === 'left' ? -player.speed : player.speed, 0);
            }
        }
    });

    for (const key of Object.keys(keyDirMap)) {
        onKeyDown(key, () => {
            if (player.isInDialogue) return;
            if (activeDir) return;
            activeDir = keyDirMap[key];
        });
        onKeyRelease(key, () => {
            if (keyDirMap[key] === activeDir) {
                activeDir = null;
                player.stop();
            }
        });
    }

    if (!worldState) {
        worldState = {
            playerPos: player.pos,
            faintedMons: []
        }
    }

    player.pos = vec2(worldState.playerPos)

    for (const faintedMon of worldState.faintedMons) {
        destroy(get(faintedMon[0]))
    }

    player.onCollide('npc', () => {
        player.isInDialogue = true;
    })
}