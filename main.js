import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";
kaplay({
    width: 1280,
    height: 720,
    scale: 0.7
});

setBackground(Color.fromHex('#36A6E0'))

loadAssets();

scene('world', (worldState) => setWorld(worldState));
scene('battle', (worldState) => setBattle(worldState));
scene('blackjack', (worldState) => setBlackjack(worldState));

go('world');