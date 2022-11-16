const Vector = require('./Position.js');
const {generatePosKnight} = require('./generatePosKnight')


function generate_base_movesets(chessboard, player_turn) {
  let movesets = {};
  for (const chesspiece of chessboard.flat()) {
    if (chesspiece && chesspiece.player == player_turn) {
      movesets[chesspiece.id] = generate_moveset(chesspiece, chesspiece.move_type, chessboard);
    }
  }
  return movesets;
}


function generate_moveset(chesspiece, move_type, chessboard) {
  switch (move_type) {
    case 'rook':
      return generate_moveset_rook(chesspiece.pos, chessboard);
    case 'bishop':
      return generate_moveset_bishop(chesspiece.pos, chessboard);
    case 'queen':
      let moveset = generate_moveset_rook(chesspiece.pos, chessboard);
      moveset = moveset.concat(generate_moveset_bishop(chesspiece.pos,chessboard));
      return moveset;
    case 'knight':
      return generate_moveset_knight(chesspiece.pos, chessboard);
    case 'pawn':
      return generate_moveset_pawn(chesspiece.pos, chessboard);
    case 'king':
      return generate_moveset_king(chesspiece.pos, chessboard);
  }
}


function generate_moveset_rook(pos_start, chessboard) {
  let moveset = generate_moveset_line(pos_start, new Vector(1, 0), chessboard);
  moveset = moveset.concat(generate_moveset_line(pos_start, new Vector(-1, 0), chessboard));
  moveset = moveset.concat(generate_moveset_line(pos_start, new Vector(0, 1), chessboard));
  moveset = moveset.concat(generate_moveset_line(pos_start, new Vector(0, -1), chessboard));

  return moveset;
}


function generate_moveset_bishop(pos_start, chessboard) {
  let moveset = generate_moveset_line(pos_start, new Vector(-1, -1), chessboard);
  moveset = moveset.concat(generate_moveset_line(pos_start, new Vector(-1, 1), chessboard));
  moveset = moveset.concat(generate_moveset_line(pos_start, new Vector(1, -1), chessboard));
  moveset = moveset.concat(generate_moveset_line(pos_start, new Vector(1, 1), chessboard));

  return moveset;
}


function generate_moveset_line(pos_start, vector_increment, chessboard) {
  let moveset = [];
  for (let pos = Vector.sum(pos_start, vector_increment); is_within_chessboard(pos); pos = Vector.sum(pos, vector_increment)) {
    if (!chessboard[pos.y][pos.x])
      moveset.push({pos: new Vector(pos.x, pos.y), capture: null});
    else if (chessboard[pos_start.y][pos_start.x].player == chessboard[pos.y][pos.x].player) {
      break;
    }
    else {
      moveset.push({pos: new Vector(pos.x, pos.y), capture: chessboard[pos.y][pos.x]});
      break;
    }
  }
  return moveset;
}


function generate_moveset_knight(pos_start, chessboard) {
  let moveset = [];
  const pos_dests = generatePosKnight(pos_start, chessboard);

  for (let pos of pos_dests) {
    let chesspiece_moving = chessboard[pos_start.y][pos_start.x];
    let chesspiece_dest = chessboard[pos.y][pos.x];
    if (!chesspiece_dest)
      moveset.push({pos: pos, capture: null});
    else if (chesspiece_dest.player != chesspiece_moving.player)
      moveset.push({pos: pos, capture: chesspiece_dest});
  }
  return moveset;
}


function generate_moveset_pawn(pos_start, chessboard) {
  let chesspiece_moving = chessboard[pos_start.y][pos_start.x];
  let dir = chesspiece_moving.player == 1 ? -1 : 1;
  let moveset = [];
  let pos_dest = Vector.sum(pos_start, new Vector(0, 1*dir));
  if (!chessboard[pos_dest.y][pos_dest.x]) {
    moveset.push({pos: pos_dest, capture: null});

    pos_dest = Vector.sum(pos_start, new Vector(0, 2*dir));
    if (!chesspiece_moving.has_moved && !chessboard[pos_dest.y][pos_dest.x])
      moveset.push({pos: pos_dest, capture: null});
  }

  pos_dest = Vector.sum(pos_start, new Vector(1, 1*dir));
  let chesspiece_dest = chessboard[pos_dest.y][pos_dest.x];
  if (chesspiece_dest && chesspiece_dest.player != chesspiece_moving.player)
    moveset.push({pos: pos_dest, capture: chesspiece_dest});

  pos_dest = Vector.sum(pos_start, new Vector(-1, 1*dir));
  chesspiece_dest = chessboard[pos_dest.y][pos_dest.x];
  if (chesspiece_dest && chesspiece_dest.player != chesspiece_moving.player)
    moveset.push({pos: pos_dest, capture: chesspiece_dest});

  moveset = moveset.concat(generate_enpassant(pos_start, chessboard));
  return moveset;
}


function generate_enpassant(pos_start, chessboard) {
  let moveset = [];
  let chesspiece_moving = chessboard[pos_start.y][pos_start.x];
  let dir = chesspiece_moving.player == 1 ? -1 : 1;

  let pos_targets = [
    Vector.sum(pos_start, new Vector(1, 0)),
    Vector.sum(pos_start, new Vector(-1, 0))
  ];
  for (let pos_target of pos_targets) {
    let chesspiece_target = chessboard[pos_target.y][pos_target.x];
    if (chesspiece_target && chesspiece_target.vulnerable_to_enpassant) {
      let pos_dest = Vector.sum(pos_target, new Vector(0, dir));
      moveset.push({pos: pos_dest, capture: chesspiece_target});
    }
  }
  return moveset;
}


function generate_moveset_king(pos_start, chessboard) {
  let pos_dests = [
    new Vector(1, 0),
    new Vector(1, 1),
    new Vector(0, 1),
    new Vector(-1, 1),
    new Vector(-1, 0),
    new Vector(-1, -1),
    new Vector(0, -1),
    new Vector(1, -1)
  ];
  pos_dests = pos_dests.map(pos => Vector.sum(pos, pos_start));
  pos_dests = pos_dests.filter(pos => is_within_chessboard(pos));

  let chesspiece_moving = chessboard[pos_start.y][pos_start.x];
  let moveset = [];
  for (let pos_dest of pos_dests) {
    let chesspiece_dest = chessboard[pos_dest.y][pos_dest.x];
    if (!chesspiece_dest)
      moveset.push({pos: pos_dest, capture: null});
    else if (chesspiece_dest.player != chesspiece_moving.player)
      moveset.push({pos: pos_dest, capture: chesspiece_dest});
  }

  return moveset;
}


function is_within_chessboard(pos) {
  return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
}


module.exports = generate_base_movesets;
