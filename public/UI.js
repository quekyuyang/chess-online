import {init, setNames, update, setMessage} from "./render.js"
import {SpriteManager} from "./SpriteManager.js"


class UI {
  constructor(gameData, move_piece) {
    const sprites = init(gameData.chesspieces1.concat(gameData.chesspieces2));
    setNames(gameData.playerName, gameData.opponentName)
    this.updateBoard(gameData)
    this.sprite_manager = new SpriteManager(sprites, move_piece);
  }

  updateBoard(gameState) {
    update(gameState.chesspieces1.concat(gameState.chesspieces2), gameState.graveyard)
  }
  
  updateViewPlayerMove(gameState) {
    if (gameState.checkmate) {
      setMessage('You win')
    }
    else if (gameState.stalemate) {
      setMessage('Stalemate')
    }
    else {
      setMessage('')
    }

    this.disableMove()
  }

  updateViewOpponentMove(gameState) {
    this.updateBoard(gameState)
  
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

    this.enableMove(gameState.moves)
  }

  enableMove(moves) {
    this.sprite_manager.enable_move(moves)
  }

  disableMove() {
    this.sprite_manager.disable_move()
  }
}


export {UI}