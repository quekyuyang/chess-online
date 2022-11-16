const Vector = require('./Position.js');


function generatePosKnight(pos_start) {
  const pos_rel = [
    new Vector(1, 2),
    new Vector(-1, 2),
    new Vector(1, -2),
    new Vector(-1, -2),
    new Vector(2, 1),
    new Vector(2, -1),
    new Vector(-2, 1),
    new Vector(-2, -1),
  ];

  const pos_abs = pos_rel.map(pos => Vector.sum(pos_start, pos))
                  .filter(pos => isWithinChessboard(pos))
  return pos_abs
}


function isWithinChessboard(pos) {
  return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
}


module.exports = {generatePosKnight};
