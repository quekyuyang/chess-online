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

  export {flipBoard, flipMoves}