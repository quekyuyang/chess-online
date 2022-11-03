import {init, update} from "./render.js"
import {SpriteManager} from "./SpriteManager.js"
import {send_move_to_server, get_match_state} from "./server_comms.js"


class Game {
  async init(get_match_data) {
    await get_match_data()
    .then((data) => {
      const sprites = init(data.chessboard.flat());
      update(data.chessboard, data.graveyard);
      this.sprite_manager = new SpriteManager(sprites, this.move_piece.bind(this));
      if (data.first_move)
        this.sprite_manager.enable_move(data.moves);
      else
        this.wait_for_update();
    });
  }

  async move_piece(id, x, y) {
    await send_move_to_server(id, x, y)
    .then((data) => {
      if (data.success) {
        update(data.chessboard, data.graveyard);
        this.sprite_manager.disable_move();
        this.wait_for_update();
      }
    });
  }

  wait_for_update() {
    return get_match_state()
    .then((state) => {
      update(state.chessboard, state.graveyard);
      this.sprite_manager.enable_move(state.moves);
    });
  }
}


export {Game}
