var Vector = require('./Position.js');


function find_king_threats(king, chessboard) {
  let threats = [];
  let pins = [];

  let [new_threats, new_pins] = check_hori_vert(king, new Vector(1, 0), chessboard);
  threats = threats.concat(new_threats);
  pins = pins.concat(new_pins);
  [new_threats, new_pins] = check_hori_vert(king, new Vector(-1, 0), chessboard);
  threats = threats.concat(new_threats);
  pins = pins.concat(new_pins);

  return [threats, pins];
}


function check_hori_vert(king, vector_increment, chessboard) {
  let threats = [];
  let pins = [];
  let obstructs = [];

  for (let pos=Vector.sum(king.pos, vector_increment); is_within_chessboard(pos) && obstructs.length<3; pos=Vector.sum(pos, vector_increment)) {
    if (chessboard[pos.y][pos.x]) {
      obstructs.push(chessboard[pos.y][pos.x]);
    }
  }

  if (
    obstructs[0] &&
    obstructs[0].player!=king.player &&
    (obstructs[0].move_type == 'rook' || obstructs[0].move_type == 'queen')
  ) {
    threats.push(obstructs[0]);
  }
  else if (
    obstructs[1] &&
    obstructs[0].player==king.player &&
    obstructs[1].player!=king.player &&
    (obstructs[1].move_type == 'rook' || obstructs[1].move_type == 'queen')
  ) {
    pins.push({pinned: obstructs[0], pinning: obstructs[1], king: king});
  }
  else if (
    obstructs[2] &&
    vector_increment.y == 0 &&
    (obstructs[2].move_type == 'rook' || obstructs[2].move_type == 'queen') &&
    obstructs[0].move_type == 'pawn' &&
    obstructs[1].move_type == 'pawn' &&
    obstructs[0].player != obstructs[1].player
  ) {
    pins.push(
      {
        pinned: obstructs[0].player == king.player ? obstructs[0] : obstructs[1],
        pinning: obstructs[2],
        king: king
      }
    )
  }

  return [threats, pins];
}

function is_within_chessboard(pos) {
  return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
}


module.exports = find_king_threats;
