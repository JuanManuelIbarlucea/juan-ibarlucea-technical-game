import { EVENTS_NAME, GameStatus } from "@/consts";
import { Actor } from "./Actor";
import { Text } from "./Text";

enum HealthState {
    IDLE,
    DAMAGE,
    DEAD,
}
export class Player extends Actor {
    private hpValue: Text;
    private healthState = HealthState.IDLE;
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private keySpace: Phaser.Input.Keyboard.Key;
    private damageTime = 0;
    private attackCooldown = 1500;
    private currentCooldown = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "king");

        this.hpValue = new Text(
            this.scene,
            this.x,
            this.y - this.height,
            this.hp.toString(),
            "#FF0000"
        )
            .setFontSize(12)
            .setOrigin(0.8, 0.5);

        // KEYS
        this.keyW = this.scene.input.keyboard!.addKey("W");
        this.keyA = this.scene.input.keyboard!.addKey("A");
        this.keyS = this.scene.input.keyboard!.addKey("S");
        this.keyD = this.scene.input.keyboard!.addKey("D");
        this.keySpace = this.scene.input.keyboard!.addKey(32);
        this.keySpace.on("down", (event: KeyboardEvent) => {
            if (this.currentCooldown > 0) return;
            this.anims.play("attack", true);
            this.scene.game.events.emit(EVENTS_NAME.attack);
            this.currentCooldown = this.attackCooldown;
        });

        // PHYSICS
        this.getBody()?.setSize(30, 30);
        this.getBody()?.setOffset(8, 0);

        this.initAnimations();
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
        switch (this.healthState) {
            case HealthState.IDLE:
                break;

            case HealthState.DAMAGE:
                this.damageTime += delta;
                if (this.damageTime >= 250) {
                    this.healthState = HealthState.IDLE;
                    this.setTint(0xffffff);
                    this.damageTime = 0;
                }
                break;
        }
    }
    update(): void {
        if (this.healthState === HealthState.IDLE) {
            this.getBody()?.setVelocity(0);
        }

        if (this.keyW?.isDown) {
            this.getBody()?.setVelocityY(-110);
            !this.anims.isPlaying && this.anims.play("run", true);
        }
        if (this.keyA?.isDown) {
            this.getBody()?.setVelocityX(-110);
            this.checkFlip();
            this.getBody()?.setOffset(48, 15);
            !this.anims.isPlaying && this.anims.play("run", true);
        }
        if (this.keyS?.isDown) {
            this.getBody()?.setVelocityY(110);
            !this.anims.isPlaying && this.anims.play("run", true);
        }
        if (this.keyD?.isDown) {
            this.getBody()?.setVelocityX(110);
            this.checkFlip();
            this.getBody()?.setOffset(15, 15);
            !this.anims.isPlaying && this.anims.play("run", true);
        }

        // Health
        this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
        this.hpValue.setOrigin(0.8, 0.5);

        // Cooldown

        this.currentCooldown = Math.max(0, this.currentCooldown - 10);
    }

    public getDamage(value?: number, dir?: Phaser.Math.Vector2): void {
        this.hpValue.setText(this.hp.toString());

        if (this.hp <= 0) {
            this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE);
        } else {
            if (dir) {
                this.setVelocity(dir.x, dir.y);
            }
            this.healthState = HealthState.DAMAGE;
            this.damageTime = 0;
        }

        super.getDamage(value, dir);
    }

    private initAnimations(): void {
        this.scene.anims.create({
            key: "run",
            frames: this.scene.anims.generateFrameNames("a-king", {
                prefix: "run-",
                end: 7,
            }),
            frameRate: 8,
        });

        this.scene.anims.create({
            key: "attack",
            frames: this.scene.anims.generateFrameNames("a-king", {
                prefix: "attack-",
                end: 2,
            }),
            frameRate: 8,
        });
    }
}

