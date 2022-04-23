import { Level } from '../../../GameEngine.js';
import mainCamera from '../cameras/mainCamera.js';
import background from '../entities/background.js';
import ball from '../entities/ball.js';
import mainLevelLight from '../entities/lighting/mainLevelLight.js';
import player1 from '../entities/player1.js';
import player2 from '../entities/player2.js';
import scoreText from '../entities/scoreText.js';

const mainLevel = new Level();

mainLevel.camera = mainCamera;
mainLevel.entities = [
    background,
    player1,
    player2,
    ball,
    scoreText,
    mainLevelLight,
];

export default mainLevel;