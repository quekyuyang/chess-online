import {init} from "./render.js"
import {initUpdateView, updateView, updateViewPlayerMove, updateViewOpponentMove} from "./UI.js"
import {SpriteManager} from "./SpriteManager.js"
import {newMatch, send_move_to_server, getGameState} from "./server_comms.js"
import {flipPositions} from "./chessboardFlip.js"


class Game {
  async init() {
    await newMatch()
    .then((gameState) => {
      this.color = gameState.color;
      if (this.color == 2) {flipPositions(gameState)}

      this.state = gameState
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
    const chesspieces = this.color == 1 ? this.state.chesspieces1 : this.state.chesspieces2
    const chesspiece = chesspieces.find(chesspiece => chesspiece.id == id)
    chesspiece._pos.x = x
    chesspiece._pos.y = y
    const move = this.state.moves[id].find(move => move.pos.x == x && move.pos.y == y)
    if (move && move.castlingPartner) {
      const castlingPartnerPiece = chesspieces.find(chesspiece => chesspiece.id == move.castlingPartner.id)
      castlingPartnerPiece._pos.x = move.castlingPartner.move.pos.x
      castlingPartnerPiece._pos.y = move.castlingPartner.move.pos.y
    }
    updateView(this.state)

    if (this.color == 2) {
      y = 7-y
      x = 7-x
    }
    await send_move_to_server(id, x, y)
    .then((gameState) => {
      if (gameState.success) {
        if (this.color == 2) {flipPositions(gameState)}

        this.state = gameState
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

      this.state = gameState
      updateViewOpponentMove(gameState)
      this.sprite_manager.enable_move(gameState.moves);
    });
  }
}


export {Game}
