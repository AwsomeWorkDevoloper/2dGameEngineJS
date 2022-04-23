import { Collider, Entity, GMath, PhysicsBody } from "../../../GameEngine.js";
import player from "../inherit/player.js";
import Game from "../main.js";

const player2 = new Entity(60, 10, 30, 50);


player2.render.type = 'rect';

player2.render.color = 'blue';

player2.score = 0;

player2.collider = new Collider(player2);
player2.physicsBody = new PhysicsBody(player2, []);

player2.onUpdate = () => {
    player.movement(Game, player2, 'arrowup', 'arrowdown');

    player2.transform.position.x = Game.viewport.width - 100;
}

export default player2;