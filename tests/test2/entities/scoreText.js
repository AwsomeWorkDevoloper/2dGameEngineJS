import { Entity } from "../../../GameEngine.js";
import Game from "../main.js";
import player1 from "./player1.js";
import player2 from "./player2.js";

const scoreText = new Entity(0, 0, 0, 0);

scoreText.render.type = 'text';
scoreText.render.color = 'black';

scoreText.onUpdate = () => {
    scoreText.transform.position = {
        x: Game.viewport.center().x - 32,
        y: 200
    };
    scoreText.render.text.content = `${player1.score} - ${player2.score}`;
}

export default scoreText;