import { Entity, Light } from "../../../../GameEngine.js";
import Game from "../../main.js";

const mainLevelLight = new Entity(0, 0, 0, 0);

mainLevelLight.onAwake = () => {
    mainLevelLight.render.type = 'light';
    mainLevelLight.render.lightData = new Light(mainLevelLight, 8000, 1, 0.1);
}

mainLevelLight.onUpdate = () => {
    mainLevelLight.transform.position = Game.viewport.center();
};

export default mainLevelLight;