import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";
kaplay({
    width: 1280,
    height: 720,
    scale: 0.7
});

setBackground(Color.fromHex('#36A6E0'))

loadAssets();

document.addEventListener('DOMContentLoaded', () => {
    Object.assign(document.body.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        margin: '0',
        backgroundImage: "url('./assets/sky-background.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
    });
});


scene('world', (worldState) => setWorld(worldState));
scene('battle', (worldState) => setBattle(worldState));
scene('blackjack', (worldState) => setBlackjack(worldState));
scene('dino', (worldState) => setDino(worldState));
go('world');