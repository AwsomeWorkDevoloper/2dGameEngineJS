import { Collider, Entity } from "../../../GameEngine.js";
import Game from "../main.js";

const ground = new Entity(0, 0, 0, 0);

ground.collider = new Collider(ground);
ground.render.color = '#03b500';

ground.onUpdate = () => {
    ground.transform.size = {
        width: 10000,
        height: 10000
    };

    ground.transform.position = {
        x: -10000 / 2,
        y: Game.viewport.height
    };
};

export default ground;