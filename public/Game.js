import {init, setNames, update, setMessage} from "./render.js"
import {SpriteManager} from "./SpriteManager.js"
import {newMatch, send_move_to_server, getGameState} from "./server_comms.js"
import {flipBoard, flipMoves} from "./chessboardFlip.js"


class Game {
  async init() {
    await newMatch()
    .then((gameState) => {
      this.color = gameState.color;
      if (this.color == 2) {flipBoard(gameState)}

      const sprites = init(gameState.chesspieces1.concat(gameState.chesspieces2));
      setNames(gameState.playerName, gameState.opponentName)
      update(gameState.chesspieces1.concat(gameState.chesspieces2), gameState.graveyard);
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
        if (this.color == 2) {flipBoard(data)}
        update(data.chesspieces1.concat(data.chesspieces2), data.graveyard)
        this.sprite_manager.disable_move()
        if (data.checkmate) {
          setMessage('You win')
        }
        else if (data.stalemate) {
          setMessage('Stalemate')
        }
        else {
          setMessage('')
          this.wait_for_update()
        }
      }
    })
  }

  wait_for_update() {
    return getGameState()
    .then((gameState) => {
      if (this.color == 2) {flipBoard(gameState)}
      const moves = this.color == 1 ? gameState.moves : flipMoves(gameState.moves)

      update(gameState.chesspieces1.concat(gameState.chesspieces2), gameState.graveyard);
      if (gameState.check) {
        setMessage('Check')
      }
      else if (gameState.checkmate) {
        setMessage('Checkmate')
      }
      else if (gameState.stalemate) {
        setMessage('Stalemate')
      }
      else {
        setMessage('')
      }
      this.sprite_manager.enable_move(moves);
    });
  }
}


export {Game}
