var Vector = require('./Position.js');
const {generatePosKnight} = require('./generatePosKnight');


function king_is_threatened(king, chessboard) {
  const [threats, pins] = find_king_threats(king, chessboard)
  return threats.length > 0
}

// Remove king in name? Don't necessarily apply only to king
function find_king_threats(king, chessboard) {
  let threats = [];
  let pins = [];

  let [new_threats, new_pins] = check_horizontal(king, new Vector(1, 0), chessboard);
  threats = threats.concat(new_threats);
  pins = pins.concat(new_pins);
  [new_threats, new_pins] = check_horizontal(king, new Vector(-1, 0), chessboard);
  threats = threats.concat(new_threats);
  pins = pins.concat(new_pins);
  [new_threats, new_pins] = check_vertical(king, new Vector(0, 1), chessboard);
  threats = threats.concat(new_threats);
  pins = pins.concat(new_pins);
  [new_threats, new_pins] = check_vertical(king, new Vector(0, -1), chessboard);
  threats = threats.concat(new_threats);
  pins = pins.concat(new_pins);
  [new_threats, new_pins] = check_diagonal(king, new Vector(1, 1), chessboard);
  threats = threats.concat(new_threats);
  pins = pins.concat(new_pins);
  [new_threats, new_pins] = check_diagonal(king, new Vector(1, -1), chessboard);
  threats = threats.concat(new_threats);
  pins = pins.concat(new_pins);
  [new_threats, new_pins] = check_diagonal(king, new Vector(-1, -1), chessboard);
  threats = threats.concat(new_threats);
  pins = pins.concat(new_pins);
  [new_threats, new_pins] = check_diagonal(king, new Vector(-1, 1), chessboard);
  threats = threats.concat(new_threats);
  pins = pins.concat(new_pins);

  new_threats = check_knight_threats(king, chessboard);
  threats = threats.concat(new_threats);
  new_threats = check_pawn_threats(king, chessboard);
  threats = threats.concat(new_threats);

  return [threats, pins];
}


function check_horizontal(king, vector_increment, chessboard) {
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
    const enemy_pawn = obstructs[0].player != king.player ? obstructs[0] : obstructs[1]
    for (const threat of find_enpassant_threats(enemy_pawn, chessboard)) {
      pins.push({pinned: threat, pinning: obstructs[2], king: king})
    }
  }

  return [threats, pins];
}


function check_vertical(king, vector_increment, chessboard) {
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

  return [threats, pins];
}


function check_diagonal(king, vector_increment, chessboard) {
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
    (obstructs[0].move_type == 'bishop' || obstructs[0].move_type == 'queen')
  ) {
    threats.push(obstructs[0]);
  }
  else if (
    obstructs[1] &&
    obstructs[0].move_type != 'pawn' &&
    obstructs[0].player==king.player &&
    obstructs[1].player!=king.player &&
    (obstructs[1].move_type == 'bishop' || obstructs[1].move_type == 'queen')
  ) {
    pins.push({pinned: obstructs[0], pinning: obstructs[1], king: king});
  }
  else if (
    obstructs[1] &&
    obstructs[0].move_type == 'pawn' &&
    obstructs[0].player != king.player &&
    obstructs[1].player != king.player &&
    (obstructs[1].move_type == 'bishop' || obstructs[1].move_type == 'queen')
  ) {
    const enpassant_threats = find_enpassant_threats(obstructs[0], chessboard)
    for (const threat of enpassant_threats) {
      pins.push({pinned: threat, pinning: obstructs[1], king: king})
    }
  }

  return [threats, pins];
}


function check_knight_threats(king, chessboard) {
  const pos = generatePosKnight(king.pos, chessboard)
  const threats = pos.map(pos => chessboard[pos.y][pos.x])
                  .filter(chesspiece => chesspiece !== null)
                  .filter(chesspiece => chesspiece.move_type == 'knight')
                  .filter(chesspiece => chesspiece.player != king.player)
  return threats
}


function check_pawn_threats(king, chessboard) {
  const y_dir = king.player==1 ? -1 : 1
  const rel_pos = [new Vector(1, y_dir), new Vector(-1, y_dir)]
  const abs_pos = rel_pos.map(vec => {
    const pos = Vector.sum(king.pos, vec)
    if (is_within_chessboard(pos))
      return pos
  })
  const threats = abs_pos.map(pos => chessboard[pos.y][pos.x])
                  .filter(chesspiece => chesspiece !== null)
                  .filter(chesspiece => chesspiece.move_type == 'pawn')
                  .filter(chesspiece => chesspiece.player != king.player)
  return threats
}


function find_enpassant_threats(chesspiece, chessboard) {
  // Find all chesspieces that can execute en passant on chesspiece

  if (!chesspiece.vulnerable_to_enpassant)
    return []

  let threats = []
  const chesspiece_left = chessboard[chesspiece.pos.y][chesspiece.pos.x-1]
  const chesspiece_right = chessboard[chesspiece.pos.y][chesspiece.pos.x+1]

  if (chesspiece_left !== null &&
      chesspiece_left.move_type == 'pawn' &&
      chesspiece_left.player != chesspiece.player)
    threats.push(chesspiece_left)
  if (chesspiece_right !== null &&
      chesspiece_right.move_type == 'pawn' &&
      chesspiece_right.player != chesspiece.player)
    threats.push(chesspiece_right)
  return threats
}


function is_within_chessboard(pos) {
  return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
}


module.exports = {find_king_threats, king_is_threatened};
