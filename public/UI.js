import {init, setNames, update, setMessage} from "./render.js"


function initUpdateView(gameState) {
  setNames(gameState.playerName, gameState.opponentName)
  updateView(gameState)
}


function updateView(gameState) {
  update(gameState.chesspieces1.concat(gameState.chesspieces2), gameState.graveyard)
}


function updateViewPlayerMove(gameState) {
  if (gameState.checkmate) {
    setMessage('You win')
  }
  else if (gameState.stalemate) {
    setMessage('Stalemate')
  }
  else {
    setMessage('')
  }
}


function updateViewOpponentMove(gameState) {
  updateView(gameState)

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
}


export {initUpdateView, updateView, updateViewPlayerMove, updateViewOpponentMove}