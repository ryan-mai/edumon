function setDino(worldState) {
    const FLOOR_HEIGHT = 48;
    const JUMP_FORCE = 800;
    const SPEED = 480;

    const prevGrav = setGravity(1600);
    
    function exitToBattle() {
        setGravity(prevGrav || 0);
        go("battle", worldState);
    }
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
    ]);

    const player = add([
        sprite('player-down'),
        pos(120, height() - FLOOR_HEIGHT - 64),
        scale(2.5),
        area(),
        body(),
        "runner-player",
    ]);

    function jump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }
    onKeyPress("space", jump);
    onClick(jump);

    let score = 0;
    const scoreLabel = add([text("0"), pos(24, 24), { value: 0 }]);

    let spawnInterval = 1.4;
    const MIN_SPAWN_INTERVAL = 0.45;
    const SPEED_GROWTH_CAP = 400;
    const SPEED_GROWTH_STEP = 40;

    function spawnTree() {
        const speedIncrease = Math.min(SPEED_GROWTH_CAP, Math.floor(score / 60) * SPEED_GROWTH_STEP);
        const currSpeed = SPEED + speedIncrease;

        add([
            rect(48, rand(32, 96)),
            area(),
            outline(4),
            pos(width() + rand(0, 180), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            color(255, 180, 255),
            move(LEFT, currSpeed),
            "tree",
        ]);

        spawnInterval = Math.max(MIN_SPAWN_INTERVAL, spawnInterval - 0.02);
        wait(rand(spawnInterval * 0.9, spawnInterval * 1.1), spawnTree);
    }

    wait(spawnInterval, spawnTree);

    player.onCollide("tree", () => {
        const attack = Math.min(250, Math.floor(score / 8));
        if (score > 1000) coins += 3;
        worldState.attack = attack;
        worldState.phase = "player-turn";
        worldState.returnFromDino = true;
        exitToBattle();
    });

    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });

    onKeyPress("escape", () => {
        worldState.attack = 0;
        worldState.returnFromDino = true;
        exitToBattle();
    });
}