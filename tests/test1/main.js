import { GEngineGame } from '../../GameEngine.js';
import mainLevel from './levels/mainLevel.js';

const Game = new GEngineGame(document.querySelector('canvas'));

Game.levels = [
    mainLevel
];

Game.Start();

export default Game;