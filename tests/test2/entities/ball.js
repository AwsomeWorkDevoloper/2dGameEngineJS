import { Collider, Entity, GMath, PhysicsBody } from "../../../GameEngine.js";
import Game from "../main.js";
import player1 from "./player1.js";
import player2 from "./player2.js";

const ball = new Entity(150, 50, 20, 20);

ball.render.type = 'rect';

ball.render.color = 'green';

ball.direction = 1;
ball.speed = 5;

ball.collider = new Collider(ball);
ball.physicsBody = new PhysicsBody(ball, [player1, player2]);


ball.onUpdate = () => {
    ball.physicsBody.vx = ball.direction * ball.speed;

    ball.physicsBody.step();

    ball.physicsBody.gravitySpeed = 0;

    if (ball.collider.HasCollided(player1)) {
        ball.direction = 1;
        ball.physicsBody.vx = ball.direction * ball.speed;

        console.log(ball.physicsBody.vx)
    }

    if (ball.collider.HasCollided(player2)) {
        ball.direction = -1;
        ball.physicsBody.vx = ball.direction * ball.speed;

        console.log(ball.physicsBody.vx)
    }

    ball.transform.position.y = GMath.Clamp(
        ball.transform.position.y,
        0, Game.viewport.height - 20
    )
}

export default ball;