var { Rook, Bishop, Queen, Knight, Pawn, King } = require("./ChessPiece.js")
var Vector = require("./Position.js");


class Chessboard {
  constructor(chesspieces1_data, chesspieces2_data, graveyard_data) {
    this.chessboard = create_chessboard_array();
    this.chesspieces1 = [];
    this.chesspieces2 = [];
    this.graveyard = []; // objects in graveyard are not necessarily ChessPiece
                         // objects! See restore_piece_to_graveyard method

    if (chesspieces1_data) {
      for (const data of chesspieces1_data) {
        this._restore_piece(data);
      }

      for (const data of chesspieces2_data) {
        this._restore_piece(data);
      }

      for (const data of graveyard_data) {
        this._restore_piece_to_graveyard(data);
      }
    }
  }

  init() {
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

    this.init_pawns();
  }

  add_piece(chesspiece) {
    if (chesspiece.player == 1)
      this.chesspieces1.push(chesspiece);
    else
      this.chesspieces2.push(chesspiece);
    this.chessboard[chesspiece.pos.y][chesspiece.pos.x] = chesspiece;
  }

  add_rook(player, pos, id) {
    const rook = new Rook(player, pos.y, pos.x, id ? id : this.count_pieces())
    this.add_piece(rook)
  }

  add_bishop(player, pos, id) {
    const bishop = new Bishop(player, pos.y, pos.x, id ? id : this.count_pieces())
    this.add_piece(bishop)
  }

  add_queen(player, pos, id) {
    const queen = new Queen(player, pos.y, pos.x, id ? id : this.count_pieces())
    this.add_piece(queen)
  }

  add_knight(player, pos, id) {
    const knight = new Knight(player, pos.y, pos.x, id ? id : this.count_pieces())
    this.add_piece(knight)
  }

  add_king(player, pos, id) {
    const king = new King(player, pos.y, pos.x, id ? id : this.count_pieces())
    this.add_piece(king)
  }

  add_pawn(player, pos, id, has_moved, vulnerable_to_enpassant) {
    const pawn = new Pawn(player, pos.y, pos.x, id ? id : this.count_pieces(), has_moved, vulnerable_to_enpassant)
    this.add_piece(pawn)
  }

  _restore_piece(data) {
    switch (data.move_type) {
      case 'rook':
        this.add_rook(data.player, data._pos, data.id)
        break
      case 'bishop':
        this.add_bishop(data.player, data._pos, data.id)
        break
      case 'queen':
        this.add_queen(data.player, data._pos, data.id)
        break
      case 'knight':
        this.add_knight(data.player, data._pos, data.id)
        break
      case 'king':
        this.add_king(data.player, data._pos, data.id)
        break
      case 'pawn':
        this.add_pawn(data.player, data._pos, data.id, data.has_moved, data.vulnerable_to_enpassant)
        break
    }
  }

  _restore_piece_to_graveyard(chesspiece_data) {
    this.graveyard.push(chesspiece_data)
  }

  count_pieces() {
    return (this.chesspieces1.length + this.chesspieces2.length + this.graveyard.length).toString();
  }

  init_pawns() {
    for (let i = 0; i < 8; i++) {
      this.add_pawn(1, new Vector(i, 6));
      this.add_pawn(2, new Vector(i, 1));
    }
  }

  move_piece(y, x, move) {
    if (move.capture)
      this.capture_piece(move.capture);
    const chesspiece = this.chessboard[y][x];
    this.chessboard[y][x] = null;
    this.chessboard[move.pos.y][move.pos.x] = chesspiece;
    chesspiece.pos = move.pos;
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


module.exports = Chessboard;
