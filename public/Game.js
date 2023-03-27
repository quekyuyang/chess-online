import {UI} from "./UI.js"
import {newMatch, send_move_to_server, getGameState} from "./server_comms.js"
import {flipPositions} from "./chessboardFlip.js"
import {GameState} from "./GameState.js"


class Game {
  async init() {
    await newMatch()
    .then((gameData) => {
      this.color = gameData.color;
      if (this.color == 2) {flipPositions(gameData)}

      this.state = new GameState(gameData)
      this.UI = new UI(gameData, this.move_piece.bind(this))
      if (gameData.first_move)
        this.UI.enableMove(gameData.moves);
      else
        this.wait_for_update();
    });
  }

  async move_piece(id, x, y) {
    this.state.movePiece(id, x, y)
    this.UI.updateBoard(this.state)

    if (this.color == 2) {
      y = 7-y
      x = 7-x
    }
    await send_move_to_server(id, x, y)
    .then((gameData) => {
      if (gameData.success) {
        if (this.color == 2) {flipPositions(gameData)}

        this.UI.updateViewPlayerMove(gameData)
        if (!gameData.checkmate && !gameData.stalemate) {
          this.wait_for_update()
        }
      }
    })
  }

  wait_for_update() {
    return getGameState()
    .then((gameData) => {
      if (this.color == 2) {flipPositions(gameData)}

      this.state = new GameState(gameData)
      this.UI.updateViewOpponentMove(gameData)
    });
  }
}


export {Game}
