var Vector = require('./Position.js');
const Move = require('./Move')
const generate_base_movesets = require('./base_moveset');
const filterMoves = require('./filterMoves');
const generateCastling = require('./generateCastling')


class MoveManager {
  constructor(chessboard) {
    this.chessboard = chessboard;
    this.player_turn = 2; // Start with 2 because next_turn will be called for first turn
  }

  compute_moves(playerTurn) {
    let moves = generate_base_movesets(this.chessboard.chessboard, playerTurn);
    moves = filterMoves(moves, this.chessboard, playerTurn);
    const king = this.chessboard.get_king(playerTurn)
    moves[king.id] = moves[king.id].concat(generateCastling(this.chessboard, playerTurn))
    return moves
  }

  move_piece(id, pos, player_turn) {
    const chesspieces = player_turn == 1 ? this.chessboard.chesspieces1 :
                                           this.chessboard.chesspieces2
    this.check_for_enpassant(chesspieces, player_turn);

    let movesets = this.compute_moves(player_turn);

    var chesspiece = chesspieces.find(function (chesspiece) {
      if (chesspiece && chesspiece.id == id)
        return true;
      else {
        return false;
      }
    })
    if (!chesspiece)
      return false

    const move = movesets[id].find(move => move.pos.equals(pos));
    if (move) {
      this.checkCastling(chesspiece, pos)
      this.chessboard.move_piece(chesspiece.pos.y, chesspiece.pos.x, move);
      return true;
    }
    else
      return false;
  }

  check_for_enpassant(chesspieces, player_turn) {
    for (let chesspiece of chesspieces) {
      if (chesspiece && chesspiece.vulnerable_to_enpassant && chesspiece.player == player_turn)
        chesspiece.vulnerable_to_enpassant = false;
    }
  }

  checkCastling(chesspiece, dest) {
    if (chesspiece.move_type == 'king' && !chesspiece.has_moved) {
      if (dest.x == 2) {
        const rook = this.chessboard.chessboard[dest.y][0]
        const castlingMove = new Move(new Vector(dest.x+1, dest.y))
        this.chessboard.move_piece(rook.pos.y, rook.pos.x, castlingMove)
      }
      else if (dest.x == 6) {
        const rook = this.chessboard.chessboard[dest.y][7]
        const castlingMove = new Move(new Vector(dest.x-1, dest.y))
        this.chessboard.move_piece(rook.pos.y, rook.pos.x, castlingMove)
      }
    }
  }
}


function filter_moveset_pins(chesspiece, moveset, pins) {
  for (const pin of pins) {
    if (chesspiece === pin.pinned) {
      let squares = get_squares_between(pin.king, pin.pinning);
      moveset = moveset.filter(pinned_filter(squares, pin))
      break;
    }
  }
  return moveset;
}


function pinned_filter(squares, pin) {
  return move => squares.some(pos=>pos.equals(move.pos)) || move.pos.equals(pin.pinning.pos);
}


function get_squares_between(chesspiece1, chesspiece2) {
  let squares = [];
  const diff_x = chesspiece1.pos.x - chesspiece2.pos.x;
  const diff_y = chesspiece1.pos.y - chesspiece2.pos.y;
  const dist_x = Math.abs(diff_x);
  const dist_y = Math.abs(diff_y);
  if (dist_x == dist_y) {
    const unit_vector = {x: diff_x/dist_x, y: diff_y/dist_y};
    for (let square = new Vector(chesspiece1.pos.x, chesspiece1.pos.y);
         !square.equals(new Vector(chesspiece1.pos.x, chesspiece1.pos.y));
         square = new Vector(square.x + unit_vector.x, square.y + unit_vector.y)) {
           squares.push(square);
    }
  }
  else if (diff_x == 0) {
    let y_between = get_numbers_between(chesspiece1.pos.y, chesspiece2.pos.y);
    for (const y of y_between)
      squares.push(new Vector(chesspiece1.pos.x, y));
  }
  else if (diff_y == 0) {
    let x_between = get_numbers_between(chesspiece1.pos.x, chesspiece2.pos.x);
    for (const x of x_between)
      squares.push(new Vector(x, chesspiece1.pos.y));
  }
  return squares;
}


function get_numbers_between(n1, n2) {
  let nums = []
  if (n1 < n2) {
    let num = n1 + 1;
    while (num < n2) {
      nums.push(num);
      num++;
    }
  }
  else {
    let num = n2 + 1;
    while (num < n1) {
      nums.push(num);
      num++;
    }
  }
  return nums;
}


module.exports = MoveManager;
