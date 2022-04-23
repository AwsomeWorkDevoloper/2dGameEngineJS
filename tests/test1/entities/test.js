import { Animator, Collider, Entity, GMath, PhysicsBody } from '../../../GameEngine.js';
import mainCamera from '../cameras/mainCamera.js';
import Game from '../main.js';
import ground from './ground.js';
import test2 from './test2.js';

const test = new Entity(100, 50, 50, 50);

test.render.type = 'sprite';

test.animator = new Animator(test);
test.animator.states = {
    idle: `${location.origin}/tests/test1/assets/imgs/soccerball.png`,
    other: `${location.origin}/tests/test1/assets/imgs/basketball.png`
};

test.collider = new Collider(test);
test.physicsBody = new PhysicsBody(test, [test2, ground]);

test.onAwake = async () => {
    test.animator.switchState('idle');
}

test.onUpdate = () => {
    if(Game.RequestKeys(['w', 'arrowup'], 'or')) {
        if(GMath.IsBetween(test.physicsBody.vy, 0.01, 0.05)) test.physicsBody.vy = -2;
    }
    if(Game.RequestKeys(['d', 'arrowright'], 'or')) {
        test.physicsBody.vx = 5;
    }
    if(Game.RequestKeys(['a', 'arrowleft'], 'or')) {
        test.physicsBody.vx = -5;
    }
    
    test.physicsBody.step();
    test.physicsBody.velocityXSlowdown = 0.01;
};

export default test;