import { Entity } from "../../../GameEngine.js";
import Game from "../main.js";

const background = new Entity(0, 0, 0, 0);

background.render.type = 'rect';
background.render.color = 'black';

background.onUpdate = () => {
    background.transform.size = {
        x: Game.viewport.width,
        y: Game.viewport.height
    }
}

export default background;