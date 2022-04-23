import { GMath } from "../../../GameEngine.js";

export default {
    movement: (game, player, up, down, speed=3) => {
        if(game.RequestKey(up)) {
            player.transform.position.y -= speed;
        }
        if(game.RequestKey(down)) {
            player.transform.position.y += speed;
        }

        player.transform.position.y = GMath.Clamp(player.transform.position.y, 0 + player.transform.size.height, game.viewport.height);
    }
};