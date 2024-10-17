import { Physics } from "phaser";

export class Actor extends Physics.Arcade.Sprite {
    protected hp = 50;
    protected isDamagable = true;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics?.add.existing(this);
        this.getBody()?.setCollideWorldBounds(true);
    }
    public getDamage(value?: number, dir?: Phaser.Math.Vector2): void {

        if(!this.isDamagable) return;

        this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 3,
            yoyo: true,
            alpha: 0.5,
            onStart: () => {
                if (value) {
                    this.hp = this.hp - value;
                    this.isDamagable = false;
                }
            },
            onComplete: () => {
                this.isDamagable = true;
                this.setAlpha(1);
            },
        });
    }
    public getHPValue(): number {
        return this.hp;
    }
    protected checkFlip(): void {
        if(!this.body) {
            return;
        }

        if (this.body.velocity.x < 0) {
            this.scaleX = -1;

        } else {
            this.scaleX = 1;
        }
    }
    protected getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }
}
