var { Rook, Bishop, Queen, Knight, Pawn, King } = require("./ChessPiece.js")
var Vector = require("./Position.js");


class Chessboard {
  constructor(chesspieces1_data, chesspieces2_data, graveyard_data) {
    this.chessboard = create_chessboard_array();

    if (chesspieces1_data === undefined) {
      this.chesspieces1 = [];
      this.chesspieces2 = [];
      this.graveyard = [];

      this.add_piece(1, new Vector(0, 7), 'rook', this.count_pieces());
      this.add_piece(1, new Vector(7, 7), 'rook', this.count_pieces());
      this.add_piece(1, new Vector(1, 7), 'knight', this.count_pieces());
      this.add_piece(1, new Vector(6, 7), 'knight', this.count_pieces());
      this.add_piece(1, new Vector(2, 7), 'bishop', this.count_pieces());
      this.add_piece(1, new Vector(5, 7), 'bishop', this.count_pieces());
      this.add_piece(1, new Vector(3, 7), 'queen', this.count_pieces());
      this.add_piece(1, new Vector(4, 7), 'king', this.count_pieces());

      this.add_piece(2, new Vector(0, 0), 'rook', this.count_pieces());
      this.add_piece(2, new Vector(7, 0), 'rook', this.count_pieces());
      this.add_piece(2, new Vector(1, 0), 'knight', this.count_pieces());
      this.add_piece(2, new Vector(6, 0), 'knight', this.count_pieces());
      this.add_piece(2, new Vector(2, 0), 'bishop', this.count_pieces());
      this.add_piece(2, new Vector(5, 0), 'bishop', this.count_pieces());
      this.add_piece(2, new Vector(3, 0), 'queen', this.count_pieces());
      this.add_piece(2, new Vector(4, 0), 'king', this.count_pieces());

      this.add_pawns();
    }
    else {
      this.chesspieces1 = [];
      this.chesspieces2 = [];
      this.graveyard = [];

      for (const data of chesspieces1_data) {
        this.add_piece(data.player, data._pos, data.move_type, data.id);
      }

      for (const data of chesspieces2_data) {
        this.add_piece(data.player, data._pos, data.move_type, data.id);
      }

      for (const data of graveyard_data) {
        this.add_piece_to_graveyard(data.player, data._pos, data.move_type, data.id);
      }
    }
  }

  add_piece(player, pos, type, id) {
    const chesspiece = create_piece(player, pos, type, id);
    if (player == 1)
      this.chesspieces1.push(chesspiece);
    else
      this.chesspieces2.push(chesspiece);
    this.chessboard[pos.y][pos.x] = chesspiece;
  }

  add_piece_to_graveyard(player, pos, type, id) {
    const chesspiece = create_piece(player, pos, type, id);
    this.graveyard.push(chesspiece);
  }

  count_pieces() {
    return (this.chesspieces1.length + this.chesspieces2.length + this.graveyard.length).toString();
  }

  add_pawns() {
    for (let i = 0; i < 8; i++) {
      this.add_piece(1, new Vector(i, 6), 'pawn', this.count_pieces());
      this.add_piece(2, new Vector(i, 1), 'pawn', this.count_pieces());
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


function create_piece(player, pos, type, id) {
  switch (type) {
    case 'rook':
      return new Rook(player, pos.y, pos.x, id)
    case 'bishop':
      return new Bishop(player, pos.y, pos.x, id)
    case 'queen':
      return new Queen(player, pos.y, pos.x, id)
    case 'knight':
      return new Knight(player, pos.y, pos.x, id)
    case 'pawn':
      return new Pawn(player, pos.y, pos.x, id)
    case 'king':
      return new King(player, pos.y, pos.x, id)
  }
}


module.exports = Chessboard;
