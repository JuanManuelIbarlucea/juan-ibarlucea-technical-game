import { GameObjects, Scene } from "phaser";
export class Loading extends Scene {
    private king!: GameObjects.Sprite;

    constructor() {
        super("loading-scene");
    }

    preload(): void {
        // key: 'king'
        // path from baseURL to file: 'sprites/king.png'
        this.load.setPath("assets");
        this.load.image("king", "king.png");
        this.load.atlas(
            "a-king",
            "spritesheets/a-king.png",
            "spritesheets/a-king_atlas.json"
        );

        this.load.image("tiles", "tilemaps/tiles/dungeon-16-16.png");
        this.load.spritesheet("tiles_spr", "tilemaps/tiles/dungeon-16-16.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.tilemapTiledJSON("dungeon", "tilemaps/json/dungeon.json");
    }

    create(): void {
        this.scene.start("level-1-scene");
        this.scene.start('ui-scene');
    }
}

