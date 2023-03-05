import {init, setNames, update, setMessage} from "./render.js"
import {SpriteManager} from "./SpriteManager.js"
import {get_match_data, send_move_to_server, get_match_state} from "./server_comms.js"
import {flipBoard, flipMoves} from "./chessboardFlip.js"


class Game {
  async init() {
    await get_match_data()
    .then((data) => {
      this.color = data.color;
      const chessboard = this.color == 1 ? data.chessboard : flipBoard(data.chessboard)
      const sprites = init(chessboard.flat());
      setNames(data.playerName, data.opponentName)
      update(chessboard, data.graveyard);
      this.sprite_manager = new SpriteManager(sprites, this.move_piece.bind(this));
      if (data.first_move)
        this.sprite_manager.enable_move(data.moves);
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
    return get_match_state()
    .then((state) => {
      const chessboard = this.color == 1 ? state.chessboard : flipBoard(state.chessboard)
      const moves = this.color == 1 ? state.moves : flipMoves(state.moves)

      update(chessboard, state.graveyard);
      if (state.check) {
        setMessage('Check')
      }
      else if (state.checkmate) {
        setMessage('Checkmate')
      }
      else if (state.stalemate) {
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
