import { Entity, Light } from "../../../GameEngine.js";
import test from "./test.js";

const testLight = new Entity(0, 0, 0, 0);

testLight.onAwake = () => {
    testLight.render.type = 'light';
    testLight.render.lightData = new Light(testLight, 100, 1, 0.1);
}

testLight.onUpdate = () => {
    testLight.transform.position = {
        x: test.transform.position.x + (test.transform.size.width / 2),
        y: test.transform.position.y + (test.transform.size.height / 2),
    };
}

export default testLight;