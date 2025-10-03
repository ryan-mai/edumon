function loadAssets() {
    loadSpriteAtlas('./assets/characters.png', {
        'player-down' : { x: 32, y: 82, width: 16, height: 16 },
        'player-up' : { x: 48, y: 82, width: 16, height: 16 },
        'player-side' : { x: 32, y: 98, width: 32, height: 16, sliceX: 2, sliceY: 1 },
            anims: { 'walk': { from: 0, to: 1, speed: 6 } },
        'npc': { x: 0, y: 82, width: 16, height: 16 }
    })
    loadSpriteAtlas('./assets/tiles.png', {
        'tile': { x: 0, y: 0, width: 128, height: 128, sliceX: 8, sliceY: 8,
            anims: {
                'flower': 0,
                'bigtree-tl': 1,
                'bigtree-tr': 2,
                'bigtree-bl': 9,
                'bigtree-br': 10,
                'grass-m': 14,
                'grass-tl': 17,
                'grass-tm': 18,
                'grass-tr': 19,
                'grass-mr': 25,
                'grass-ml': 27,
                'grass-bl': 33,
                'grass-bm': 34,
                'grass-br': 35,
                'smalltree-t': 3,
                'smalltree-b': 11,
                'talltree-t': 4,
                'talltree-b': 12,
                'grass-water': 20,
                'sand-1': 6,
                'ground-l': 42,
                'ground-m': 42,
                'ground-r': 43,
                'rock-water': 60,
            }
        }
    })
}