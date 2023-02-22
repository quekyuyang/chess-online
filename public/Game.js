import {init, update} from "./render.js"
import {SpriteManager} from "./SpriteManager.js"
import {get_match_data, send_move_to_server, get_match_state} from "./server_comms.js"


class Game {
  async init() {
    await get_match_data()
    .then((data) => {
      this.color = data.color;
      const chessboard = this.color == 1 ? data.chessboard : flipBoard(data.chessboard)
      const sprites = init(chessboard.flat());
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
        update(chessboard, data.graveyard);
        this.sprite_manager.disable_move();
        this.wait_for_update();
      }
    });
  }

  wait_for_update() {
    return get_match_state()
    .then((state) => {
      const chessboard = this.color == 1 ? state.chessboard : flipBoard(state.chessboard)
      const moves = this.color == 1 ? state.moves : flipMoves(state.moves)

      update(chessboard, state.graveyard);
      this.sprite_manager.enable_move(moves);
    });
  }
}


function flipBoard(chessboard) {
  const chessboardFlip = new Array(8);
  for (let i = 0; i < 8; i++) {
    chessboardFlip[i] = new Array(8).fill(null);
  }

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      chessboardFlip[7-y][7-x] = chessboard[y][x]
    }
  }

  return chessboardFlip
}

function flipMove(move) {
  return {
    pos: {y: 7-move.pos.y, x: 7-move.pos.x},
    capture: move.capture
  }
}

function flipMoves(moves) {
  const movesNew = {}
  for (const id in moves) {
    movesNew[id] = []
    for (const move of moves[id]) {
      movesNew[id].push(flipMove(move))
    }
  }
  return movesNew
}


export {Game}
