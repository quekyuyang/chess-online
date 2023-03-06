import {init, setNames, update, setMessage} from "./render.js"


function initUpdateView(gameState) {
    setNames(gameState.playerName, gameState.opponentName)
    update(gameState.chesspieces1.concat(gameState.chesspieces2), gameState.graveyard)
}


function updateViewPlayerMove(gameState) {
    update(gameState.chesspieces1.concat(gameState.chesspieces2), gameState.graveyard)

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
    update(gameState.chesspieces1.concat(gameState.chesspieces2), gameState.graveyard)

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


export {initUpdateView, updateViewPlayerMove, updateViewOpponentMove}