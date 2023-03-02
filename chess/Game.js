const Chessboard = require('./Chessboard')
const MoveManager = require('./MoveManager')


function newGame() {
    const chessboard = new Chessboard()
    chessboard.init()
    const moveManager = new MoveManager(chessboard)
    const moves = moveManager.compute_moves(1)
    return {
        chessboard: chessboard,
        moves: moves
    }
  }


  module.exports = newGame