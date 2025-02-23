import { Scene } from "phaser";
import { Time } from "@/game/classes/Time";
import { Score, ScoreOperations } from "../../classes/Score";
import { EVENTS_NAME, GameStatus } from "@/consts";
import { Text } from "@/game/classes/Text";
export class UIScene extends Scene {
    private score!: Score;
    private timeText!: Time;
    private chestLootHandler: () => void;
    private gameEndPhrase!: Text;
    private gameEndHandler: (status: GameStatus) => void;
    private enemyDeathHandler: () => void;
    private clockHandler: () => void;
    private controlsText: Text;

    constructor() {
        super("ui-scene");
        this.clockHandler = () => {
            const totalSeconds = Math.floor(this.game.getTime() / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const timeString = `${minutes}:${seconds
                .toString()
                .padStart(2, "0")}`;
            this.timeText.setText(`Time: ${timeString}`);
        };
        this.chestLootHandler = () => {
            this.score.changeValue(ScoreOperations.INCREASE, 10);
        };

        this.enemyDeathHandler = () => {
            this.score.changeValue(ScoreOperations.INCREASE, 10);
        };

        this.gameEndHandler = (status) => {
            this.cameras.main.setBackgroundColor("rgba(0,0,0,0.6)");
            this.game.scene.pause("level-1-scene");
            this.gameEndPhrase = new Text(
                this,
                this.game.scale.width / 2,
                this.game.scale.height * 0.4,
                status === GameStatus.LOSE
                    ? `YOU DIED!\nPRESS 'R' TO RESTART`
                    : `LET'S GO!!\nPRESS 'R' TO RESTART`
            )
                .setAlign("center")
                .setColor(status === GameStatus.LOSE ? "#ff0000" : "#ffffff");
            this.gameEndPhrase.setPosition(
                this.game.scale.width / 2 - this.gameEndPhrase.width / 2,
                this.game.scale.height * 0.4
            );

            this.input.keyboard!.on("keydown-R", () => {
                this.game.events.off(
                    EVENTS_NAME.enemyDeath,
                    this.enemyDeathHandler
                );
                this.game.events.off(
                    EVENTS_NAME.chestLoot,
                    this.chestLootHandler
                );
                this.game.events.off(EVENTS_NAME.gameEnd, this.gameEndHandler);
                this.scene.get("level-1-scene").scene.restart();
                this.scene.restart();
            });
        };
    }
    create(): void {
        this.score = new Score(this, 20, 20, 0);
        this.timeText = new Time(
            this,
            this.game.scale.width - this.game.scale.width / 2,
            20,
            0
        );

        this.controlsText = new Text(
            this,
            20,
            this.game.scale.height - 100,
            "WASD to move\nSPACE to attack"
        )
            .setScale(0.5)
            .setAlign("center")
            .setColor("#ffffff");
        this.initListeners();
    }

    update(time: number, delta: number): void {
        this.clockHandler();
    }

    private initListeners(): void {
        this.game.events.on(
            EVENTS_NAME.enemyDeath,
            this.enemyDeathHandler,
            this
        );
        this.game.events.on(EVENTS_NAME.chestLoot, this.chestLootHandler, this);
        this.game.events.once(EVENTS_NAME.gameEnd, this.gameEndHandler, this);
    }
}

