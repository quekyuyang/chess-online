const {king_is_threatened} = require('./king_threats.js');
const Chessboard = require('./Chessboard');


function filterMoves(moves, chessboard, player_turn) {
  const king = chessboard.get_king(player_turn)

  let moves_filtered = {}
  for (const id in moves) {
    moves_filtered[id] = []
    for (const move of moves[id]) {
      const chessboard_clone = Chessboard.clone(chessboard)
      const king_clone = chessboard_clone.chessboard[king.pos.y][king.pos.x]
      const chesspiece_clone = chessboard_clone.get_chesspiece(id)
      chessboard_clone.move_piece(chesspiece_clone.pos.y, chesspiece_clone.pos.x, move)
      if (!king_is_threatened(king_clone, chessboard_clone.chessboard))
        moves_filtered[id].push(move)
    }
  }

  return moves_filtered
}


module.exports = filterMoves;
