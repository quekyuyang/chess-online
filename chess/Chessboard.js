var { Rook, Bishop, Queen, Knight, Pawn, King } = require("./ChessPiece.js")
var Vector = require("./Position.js");


class Chessboard {
  constructor() {
    this.chessboard = create_chessboard_array();
    this.piece_count = init_piece_count();
    this.chesspieces1 = [];
    this.chesspieces2 = [];
    this.graveyard = [];

    this.add_rook(1, new Vector(0, 7));
    this.add_rook(1, new Vector(7, 7));
    this.add_knight(1, new Vector(1, 7));
    this.add_knight(1, new Vector(6, 7));
    this.add_bishop(1, new Vector(2, 7));
    this.add_bishop(1, new Vector(5, 7));
    this.add_queen(1, new Vector(3, 7));
    this.add_king(1, new Vector(4, 7));

    this.add_rook(2, new Vector(0, 0));
    this.add_rook(2, new Vector(7, 0));
    this.add_knight(2, new Vector(1, 0));
    this.add_knight(2, new Vector(6, 0));
    this.add_bishop(2, new Vector(2, 0));
    this.add_bishop(2, new Vector(5, 0));
    this.add_queen(2, new Vector(3, 0));
    this.add_king(2, new Vector(4, 0));

    this.add_pawns();
  }

  add_rook(player, pos) {
    if (player == 1)
      this.add_piece(player, pos, Rook, "w_rook");
    else
      this.add_piece(player, pos, Rook, "b_rook");
  }

  add_bishop(player, pos) {
    if (player == 1)
      this.add_piece(player, pos, Bishop, "w_bishop");
    else
      this.add_piece(player, pos, Bishop, "b_bishop");
  }

  add_queen(player, pos) {
    if (player == 1)
      this.add_piece(player, pos, Queen, "w_queen");
    else
      this.add_piece(player, pos, Queen, "b_queen");
  }

  add_knight(player, pos) {
    if (player == 1)
      this.add_piece(player, pos, Knight, "w_knight");
    else
      this.add_piece(player, pos, Knight, "b_knight");
  }

  add_pawn(player, pos) {
    if (player == 1)
      this.add_piece(player, pos, Pawn, "w_pawn");
    else
      this.add_piece(player, pos, Pawn, "b_pawn");
  }

  add_king(player, pos) {
    if (player == 1)
      this.add_piece(player, pos, King, "w_king");
    else
      this.add_piece(player, pos, King, "b_king");
  }

  add_piece(player, pos, Type, id_base) {
    let id = id_base + this.piece_count[id_base];
    this.piece_count[id_base] += 1;
    var chesspiece = new Type(player, pos.y, pos.x, id);

    if (player == 1)
      this.chesspieces1.push(chesspiece);
    else
      this.chesspieces2.push(chesspiece);

    this.chessboard[pos.y][pos.x] = chesspiece;
  }

  add_pawns() {
    for (let i = 0; i < 8; i++) {
      this.add_pawn(1, new Vector(i, 6));
      this.add_pawn(2, new Vector(i, 1));
    }
  }

  move_piece(chesspiece, move) {
    if (move) {
      if (move.capture)
        this.capture_piece(move.capture);
      this.chessboard[chesspiece.pos.y][chesspiece.pos.x] = null;
      this.chessboard[move.pos.y][move.pos.x] = chesspiece;
      chesspiece.pos = move.pos;
      return true;
    }
    else
      return false;
  }

  capture_piece(captured) {
    this.chessboard[captured.pos.y][captured.pos.x] = null;
    let index = this.chesspieces1.findIndex(chesspiece => chesspiece === captured);
    if (index != -1)
      this.chesspieces1.splice(index, 1);
    else {
      index = this.chesspieces2.findIndex(chesspiece => chesspiece === captured);
      this.chesspieces2.splice(index, 1);
    }
    this.graveyard.push(captured);
  }
}


function create_chessboard_array() {
  let chessboard = new Array(8);
  for (let i = 0; i < 8; i++) {
    chessboard[i] = new Array(8).fill(null);
  }
  return chessboard;
}


function init_piece_count() {
  return {
    "w_rook": 0,
    "w_bishop": 0,
    "w_queen": 0,
    "w_king": 0,
    "w_knight": 0,
    "w_pawn": 0,
    "b_rook": 0,
    "b_bishop": 0,
    "b_queen": 0,
    "b_king": 0,
    "b_knight": 0,
    "b_pawn": 0
  };
}


module.exports = Chessboard;
