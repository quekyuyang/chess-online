function flipPositions(gameState) {
  for (const chesspiece of gameState.chesspieces1) {
    chesspiece._pos.x = 7-chesspiece._pos.x
    chesspiece._pos.y = 7-chesspiece._pos.y
  }

  for (const chesspiece of gameState.chesspieces2) {
    chesspiece._pos.x = 7-chesspiece._pos.x
    chesspiece._pos.y = 7-chesspiece._pos.y
  }

  gameState.moves = flipMoves(gameState.moves)
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

export {flipPositions}