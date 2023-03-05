import {init, setNames, update, setMessage} from "./render.js"
import {SpriteManager} from "./SpriteManager.js"
import {newMatch, send_move_to_server, getGameState} from "./server_comms.js"
import {flipBoard, flipMoves} from "./chessboardFlip.js"


class Game {
  async init() {
    await newMatch()
    .then((gameState) => {
      this.color = gameState.color;
      const chessboard = this.color == 1 ? gameState.chessboard : flipBoard(gameState.chessboard)
      const sprites = init(chessboard.flat());
      setNames(gameState.playerName, gameState.opponentName)
      update(chessboard, gameState.graveyard);
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
        const chessboard = this.color == 1 ? data.chessboard : flipBoard(data.chessboard)
        update(chessboard, data.graveyard)
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
      const chessboard = this.color == 1 ? gameState.chessboard : flipBoard(gameState.chessboard)
      const moves = this.color == 1 ? gameState.moves : flipMoves(gameState.moves)

      update(chessboard, gameState.graveyard);
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
