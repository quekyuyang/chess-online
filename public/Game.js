import {init} from "./render.js"
import {initUpdateView, updateView, updateViewPlayerMove, updateViewOpponentMove} from "./UI.js"
import {SpriteManager} from "./SpriteManager.js"
import {newMatch, send_move_to_server, getGameState} from "./server_comms.js"
import {flipPositions} from "./chessboardFlip.js"
import {GameState} from "./GameState.js"


class Game {
  async init() {
    await newMatch()
    .then((gameState) => {
      this.color = gameState.color;
      if (this.color == 2) {flipPositions(gameState)}

      this.state = new GameState(gameState)
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
    this.state.movePiece(id, x, y)
    updateView(this.state)

    if (this.color == 2) {
      y = 7-y
      x = 7-x
    }
    await send_move_to_server(id, x, y)
    .then((gameState) => {
      if (gameState.success) {
        if (this.color == 2) {flipPositions(gameState)}

        updateViewPlayerMove(gameState)
        this.sprite_manager.disable_move()
        if (!gameState.checkmate && !gameState.stalemate) {
          this.wait_for_update()
        }
      }
    })
  }

  wait_for_update() {
    return getGameState()
    .then((gameState) => {
      if (this.color == 2) {flipPositions(gameState)}

      this.state = new GameState(gameState)
      updateViewOpponentMove(gameState)
      this.sprite_manager.enable_move(gameState.moves);
    });
  }
}


export {Game}
