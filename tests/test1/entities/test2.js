import { Animator, Collider, Entity } from '../../../GameEngine.js';
import Game from '../main.js';

const test2 = new Entity(100, 750, 50, 50);

test2.render.type = 'sprite';

test2.animator = new Animator(test2);
test2.animator.states = {
    idle: `${location.origin}/tests/test1/assets/imgs/basketball.png`,
};

test2.collider = new Collider(test2);

test2.onAwake = async () => {
    test2.animator.switchState('idle');
}

test2.onUpdate = () => {
    
};

export default test2;