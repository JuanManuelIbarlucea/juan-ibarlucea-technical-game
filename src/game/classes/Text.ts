import { GameObjects, Scene } from "phaser";
export class Text extends GameObjects.Text {
    constructor(
        scene: Scene,
        x: number,
        y: number,
        text: string,
        color = "#fff"
    ) {
        super(scene, x, y, text, {
            fontSize: "calc(100vw / 25)",
            color,
            stroke: "#000",
            strokeThickness: 4,
        });
        this.setOrigin(0, 0);
        scene.add.existing(this);
    }

    setScale(x?: number, y?: number): this {
        return super.setScale(x, y);
    }
}

