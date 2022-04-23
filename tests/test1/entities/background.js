import { Entity } from '../../../GameEngine.js';
import Game from '../main.js';

const background = new Entity(0, 0, 0, 0);

background.onAwake = () => {
    background.render.color = '#4287f5';
    background.render.affectedByCamera = false;
}

background.onUpdate = () => {
    background.transform.size.width = Game.viewport.width;
    background.transform.size.height = Game.viewport.height;
};

export default background;