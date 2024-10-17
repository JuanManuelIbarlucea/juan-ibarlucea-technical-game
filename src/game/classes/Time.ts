import { Text } from "./Text";
export enum ScoreOperations {
    INCREASE,
    SET_VALUE,
}
export class Time extends Text {
    private timeValue: number;
    constructor(scene: Phaser.Scene, x: number, y: number, time = 0) {
        super(scene, x, y, `Time: 00:00`);
        scene.add.existing(this);
        this.timeValue = time;
    }
    public changeValue(operation: ScoreOperations, value: number): void {
        switch (operation) {
            case ScoreOperations.INCREASE:
                this.timeValue += value;
                break;
            case ScoreOperations.SET_VALUE:
                this.timeValue = value;
                break;
            default:
                break;
        }
        this.setText(`Score: ${this.timeValue}`);
    }
    public getValue(): number {
        return this.timeValue;
    }
}

