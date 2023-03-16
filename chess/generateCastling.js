const {king_is_threatened} = require('./king_threats.js');
const Move = require('./Move')
const Vector = require('./Position')


function generateCastling(chessboard, playerTurn) {
  const moves = []
  const king = chessboard.get_king(playerTurn)

  if (!king.has_moved && !king_is_threatened(king, chessboard.chessboard)) {
    const rook1 = chessboard.chessboard[king.pos.y][0]
    if (rookCanCastle(chessboard, rook1, king)) {
      const xKingDest = king.pos.x - 2
      const yKingDest = king.pos.y
      moves.push(new Move(new Vector(xKingDest, yKingDest)))
    }

    const rook2 = chessboard.chessboard[king.pos.y][7]
    if (rookCanCastle(chessboard, rook2, king)) {
      const xKingDest = king.pos.x + 2
      const yKingDest = king.pos.y
      moves.push(new Move(new Vector(xKingDest, yKingDest)))
    }
  }
  
  return moves
}


function rookCanCastle(chessboard, rook, king) {
  return (
    rook && rook.move_type == 'rook' &&
    !rook.has_moved &&
    !chessboard.hasObstacleInRowBetweenCols(king.pos.y, king.pos.x, rook.pos.x)
  )
}


module.exports = generateCastling
