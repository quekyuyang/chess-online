import {init} from "./render.js"
import {initUpdateView, updateViewPlayerMove, updateViewOpponentMove} from "./UI.js"
import {SpriteManager} from "./SpriteManager.js"
import {newMatch, send_move_to_server, getGameState} from "./server_comms.js"
import {flipPositions} from "./chessboardFlip.js"


class Game {
  async init() {
    await newMatch()
    .then((gameState) => {
      this.color = gameState.color;
      if (this.color == 2) {flipPositions(gameState)}

      const sprites = init(gameState.chesspieces1.concat(gameState.chesspieces2));
      initUpdateView(gameState)
      this.sprite_manager = new SpriteManager(sprites, this.move_piece.bind(this));
      if (gameState.first_move)
        this.sprite_manager.enable_move(gameState.moves);
      else
        this.wait_for_update();
    });
  }

  async move_piece(id, x, y) {
    if (this.color == 2) {
      y = 7-y
      x = 7-x
    }
    await send_move_to_server(id, x, y)
    .then((data) => {
      if (data.success) {
        if (this.color == 2) {flipPositions(data)}
        updateViewPlayerMove(data)
        this.sprite_manager.disable_move()
        if (!data.checkmate && !data.stalemate) {
          this.wait_for_update()
        }
      }
    })
  }

  wait_for_update() {
    return getGameState()
    .then((gameState) => {
      if (this.color == 2) {flipPositions(gameState)}

      updateViewOpponentMove(gameState)
      this.sprite_manager.enable_move(gameState.moves);
    });
  }
}


export {Game}
