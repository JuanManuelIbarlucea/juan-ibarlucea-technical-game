import { Scene, Tilemaps } from "phaser";
import { Player } from "@/game/classes/Player";
import { Enemy } from "@/game/classes/Enemy";

import { gameObjectsToObjectPoints } from "@/utils/gameobjects";
import { EVENTS_NAME } from "../../consts";

type MapOptions = {
    debug: boolean;
};
export class Level1 extends Scene {
    private player!: Player;
    private map!: Tilemaps.Tilemap;
    private tileset!: Tilemaps.Tileset;
    private wallsLayer!: Tilemaps.TilemapLayer;
    private groundLayer!: Tilemaps.TilemapLayer;
    private chests!: Phaser.GameObjects.Sprite[];
    private enemies: Enemy[] = [];
    private enemySpawnRate = 5000;

    constructor() {
        super("level-1-scene");
    }
    create(): void {
        this.initMap();
        this.player = new Player(this, 100, 100);
        this.physics.add.collider(this.player, this.wallsLayer);
        this.initChests();
        this.spawnEnemies();
        this.initCamera();
        this.game.events.on(
            EVENTS_NAME.enemyDeath,
            () => {
                this.enemySpawnRate = Math.max(
                    1000,
                    this.enemySpawnRate - this.enemySpawnRate * 0.1
                );
            },
            this
        );
    }
    update(): void {
        this.player.update();
    }

    private initMap(
        { debug }: MapOptions = {
            debug: false,
        }
    ): void {
        this.map = this.make.tilemap({
            key: "dungeon",
        });

        this.tileset = this.map.addTilesetImage("dungeon", "tiles")!;
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0)!;
        this.wallsLayer = this.map.createLayer("Walls", this.tileset, 0, 0)!;
        this.physics.world.setBounds(
            0,
            0,
            this.wallsLayer.width,
            this.wallsLayer.height
        );
        this.wallsLayer.setCollisionByProperty({ collides: true });
        if (debug) {
            this.showDebugWalls();
        }
    }
    private showDebugWalls(): void {
        const debugGraphics = this.add.graphics().setAlpha(0.7);
        this.wallsLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        });
    }

    private initChests(): void {
        const chestPoints = gameObjectsToObjectPoints(
            this.map.filterObjects(
                "Chests",
                (obj) => obj.name === "ChestPoint"
            ) || []
        );
        this.chests = chestPoints.map((chestPoint) =>
            this.physics.add
                .sprite(chestPoint.x, chestPoint.y, "tiles_spr", 595)
                .setScale(1.5)
        );

        this.chests.forEach((chest) => {
            this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
                this.game.events.emit(EVENTS_NAME.chestLoot);
                obj2.destroy();
                this.cameras.main.flash();
            });
        });
    }

    private initCamera(): void {
        this.cameras.main.setSize(
            this.game.scale.width,
            this.game.scale.height
        );
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
        this.cameras.main.setZoom(3);
    }

    private spawnEnemies(): void {
        const initEnemy = () => {
            const enemyPoint = this.getRandomEnemyPoint();
            const enemy = new Enemy(
                this,
                enemyPoint.x,
                enemyPoint.y,
                "tiles_spr",
                this.player,
                503
            )
                .setName(enemyPoint.id.toString())
                .setScale(1.5);
            this.enemies.push(enemy);
            this.physics.add.collider(enemy, this.wallsLayer);
            this.physics.add.collider(enemy, this.enemies);
            this.physics.add.collider(this.player, enemy, (obj1, obj2) => {
                const enemy = obj2 as Enemy;
                const dx = this.player.x - enemy.x;
                const dy = this.player.y - enemy.y;
                const dir = new Phaser.Math.Vector2(dx, dy)
                    .normalize()
                    .scale(200);
                (obj1 as Player).getDamage(1, dir);
            });
        };
        this.time.addEvent({
            delay: this.enemySpawnRate,
            callback: initEnemy,
            loop: true,
        });
    }

    private getRandomEnemyPoint(): { x: number; y: number; id: number } {
        const enemyPoints = gameObjectsToObjectPoints(
            this.map.filterObjects(
                "Enemies",
                (obj) => obj.name === "EnemyPoint"
            ) || []
        );
        const randomIndex = Phaser.Math.Between(0, enemyPoints.length - 1);
        return enemyPoints[randomIndex];
    }
}

