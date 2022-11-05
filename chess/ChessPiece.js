var Vector = require('./Position.js');


class ChessPiece {
  constructor(player_n, y, x, id) {
    this.player = player_n;
    this._pos = new Vector(x, y);
    this.id = id;
  }

  get pos() {
    return this._pos;
  }

  set pos(pos_new) {
    this._pos = pos_new;
  }
}


class Rook extends ChessPiece {
  constructor(player_n, y, x, id) {
    super(player_n, y, x, id);
    this.move_type = "rook";
  }
}


class Bishop extends ChessPiece {
  constructor(player_n, y, x, id) {
    super(player_n, y, x, id);
    this.move_type = "bishop";
  }
}


class Queen extends ChessPiece {
  constructor(player_n, y, x, id) {
    super(player_n, y, x, id);
    this.move_type = "queen";
  }
}


class Knight extends ChessPiece {
  constructor(player_n, y, x, id) {
    super(player_n, y, x, id);
    this.move_type = "knight";
  }
}


class Pawn extends ChessPiece {
  constructor(player_n, y, x, id, has_moved) {
    super(player_n, y, x, id);
    this.move_type = "pawn";
    this.has_moved = has_moved;
    this.vulnerable_to_enpassant = false;
  }

  get pos() {
    return this._pos;
  }

  set pos(pos_new) {
    this.vulnerable_to_enpassant = (this.player == 1 && Vector.diff(pos_new, this._pos).equals(new Vector(0, -2))) ||
                                   (this.player == 2 && Vector.diff(pos_new, this._pos).equals(new Vector(0, 2)))
    this.has_moved = true;
    this._pos = pos_new;
  }
}


class King extends ChessPiece {
  constructor(player_n, y, x, id) {
    super(player_n, y, x, id);
    this.move_type = "king";
  }
}


module.exports = {Rook, Bishop, Queen, Knight, Pawn, King};
