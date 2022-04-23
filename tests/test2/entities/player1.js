import { Collider, Entity, GMath, PhysicsBody } from "../../../GameEngine.js";
import player from "../inherit/player.js";
import Game from "../main.js";

const player1 = new Entity(60, 10, 30, 50);

player1.render.type = 'rect';

player1.score = 0;

player1.collider = new Collider(player1);
player1.physicsBody = new PhysicsBody(player1, []);

player1.onUpdate = () => {
    player.movement(Game, player1, 'w', 's');
}

export default player1;