const filterMoves = require('../chess/filterMoves')
const Chessboard = require('../chess/Chessboard');


var chessboard = {};
beforeEach(() => {
  chessboard = new Chessboard();
})

test('filterMoves', () => {
  chessboard.add_rook(2, {x: 1, y: 4}, 'brook1')
  chessboard.add_king(1, {x: 4, y: 4}, 'wking')

  // For testing purpose, pretend that king has only 4 moves
  const base_moves = {
    wking: [
      new MockMove(3, 4),
      new MockMove(5, 4),
      new MockMove(3, 3),
      new MockMove(4, 3),
    ]
  }

  const moves = filterMoves(base_moves, chessboard, 1)

  const expected_moves = base_moves['wking'].slice(2)
  expect(moves['wking']).toEqual(expect.arrayContaining(expected_moves))
  expect(moves['wking'].length).toBe(2)
})


class MockMove {
  constructor(x, y) {
    this.pos = {x: x, y: y}
  }
}
