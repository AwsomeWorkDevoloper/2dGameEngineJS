import { Level } from '../../../GameEngine.js';
import mainCamera from '../cameras/mainCamera.js';
import background from '../entities/background.js';
import ground from '../entities/ground.js';
import test from '../entities/test.js';
import test2 from '../entities/test2.js';
import testLight from '../entities/testLight.js';

const mainLevel = new Level();

mainLevel.camera = mainCamera;
mainLevel.entities = [
    background,
    ground,
    test,
    test2,
    testLight
];

export default mainLevel;