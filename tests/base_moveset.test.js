const generate_base_movesets = require('../chess/base_moveset')
const Move = require('../chess/Move')
const Vector = require('../chess/Position')

var chessboard = null
beforeEach(() => {
  chessboard = new Array(8)
  for (let i = 0; i < 8; i++) {
    chessboard[i] = new Array(8).fill(null)
  }
})

test('Rook moveset', () => {
  addToChessboard('rook', 4, 3, 1)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_movesets = {
    '0': expect.arrayContaining([
      new Move(new Vector(3, 3)),
      new Move(new Vector(3, 2)),
      new Move(new Vector(3, 1)),
      new Move(new Vector(3, 0)),
      new Move(new Vector(3, 5)),
      new Move(new Vector(3, 6)),
      new Move(new Vector(3, 7)),
      new Move(new Vector(2, 4)),
      new Move(new Vector(1, 4)),
      new Move(new Vector(0, 4)),
      new Move(new Vector(4, 4)),
      new Move(new Vector(5, 4)),
      new Move(new Vector(6, 4)),
      new Move(new Vector(7, 4))
    ])
  }

  expect(movesets['0'].length).toBe(14)
  expect(movesets).toEqual(expected_movesets)
})

test('Rook moveset blocked by ally', () => {
  addToChessboard('rook', 4, 3, 1)
  addToChessboard('rook', 2, 3, 1)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_moveset = [
    new Move(new Vector(3, 3)),
    new Move(new Vector(3, 5)),
    new Move(new Vector(3, 6)),
    new Move(new Vector(3, 7)),
    new Move(new Vector(2, 4)),
    new Move(new Vector(1, 4)),
    new Move(new Vector(0, 4)),
    new Move(new Vector(4, 4)),
    new Move(new Vector(5, 4)),
    new Move(new Vector(6, 4)),
    new Move(new Vector(7, 4))
    ]

  expect(movesets['0'].length).toBe(expected_moveset.length)
  expect(movesets['0']).toEqual(expect.arrayContaining(expected_moveset))
})

test('Rook moveset blocked by enemy', () => {
  addToChessboard('rook', 4, 3, 1)
  addToChessboard('rook', 2, 3, 2)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_moveset = [
    new Move(new Vector(3, 2), chessboard[2][3]),
    new Move(new Vector(3, 3)),
    new Move(new Vector(3, 5)),
    new Move(new Vector(3, 6)),
    new Move(new Vector(3, 7)),
    new Move(new Vector(2, 4)),
    new Move(new Vector(1, 4)),
    new Move(new Vector(0, 4)),
    new Move(new Vector(4, 4)),
    new Move(new Vector(5, 4)),
    new Move(new Vector(6, 4)),
    new Move(new Vector(7, 4))
    ]

  expect(movesets['0'].length).toBe(expected_moveset.length)
  expect(movesets['0']).toEqual(expect.arrayContaining(expected_moveset))
})

test('Bishop moveset', () => {
  addToChessboard('bishop', 4, 3, 1)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_movesets = {
    '0': expect.arrayContaining([
      new Move(new Vector(2, 3)),
      new Move(new Vector(1, 2)),
      new Move(new Vector(0, 1)),
      new Move(new Vector(4, 3)),
      new Move(new Vector(5, 2)),
      new Move(new Vector(6, 1)),
      new Move(new Vector(7, 0)),
      new Move(new Vector(2, 5)),
      new Move(new Vector(1, 6)),
      new Move(new Vector(0, 7)),
      new Move(new Vector(4, 5)),
      new Move(new Vector(5, 6)),
      new Move(new Vector(6, 7))
    ]
    )
  }

  expect(movesets['0'].length).toBe(13)
  expect(movesets).toEqual(expected_movesets)
})

test('Bishop moveset blocked by ally', () => {
  addToChessboard('bishop', 4, 3, 1)
  addToChessboard('rook', 2, 5, 1)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_moveset = [
    new Move(new Vector(2, 3)),
    new Move(new Vector(1, 2)),
    new Move(new Vector(0, 1)),
    new Move(new Vector(4, 3)),
    new Move(new Vector(2, 5)),
    new Move(new Vector(1, 6)),
    new Move(new Vector(0, 7)),
    new Move(new Vector(4, 5)),
    new Move(new Vector(5, 6)),
    new Move(new Vector(6, 7))
  ]

  expect(movesets['0'].length).toBe(expected_moveset.length)
  expect(movesets['0']).toEqual(expect.arrayContaining(expected_moveset))
})

test('Bishop moveset blocked by enemy', () => {
  addToChessboard('bishop', 4, 3, 1)
  addToChessboard('rook', 2, 5, 2)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_moveset = [
    new Move(new Vector(2, 3)),
    new Move(new Vector(1, 2)),
    new Move(new Vector(0, 1)),
    new Move(new Vector(4, 3)),
    new Move(new Vector(5, 2), chessboard[2][5]),
    new Move(new Vector(2, 5)),
    new Move(new Vector(1, 6)),
    new Move(new Vector(0, 7)),
    new Move(new Vector(4, 5)),
    new Move(new Vector(5, 6)),
    new Move(new Vector(6, 7))
  ]

  expect(movesets['0'].length).toBe(expected_moveset.length)
  expect(movesets['0']).toEqual(expect.arrayContaining(expected_moveset))
})

test('Queen moveset', () => {
  addToChessboard('queen', 4, 3, 1)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_movesets = {
    '0': expect.arrayContaining([
      new Move(new Vector(3, 3)),
      new Move(new Vector(3, 2)),
      new Move(new Vector(3, 1)),
      new Move(new Vector(3, 0)),
      new Move(new Vector(3, 5)),
      new Move(new Vector(3, 6)),
      new Move(new Vector(3, 7)),
      new Move(new Vector(2, 4)),
      new Move(new Vector(1, 4)),
      new Move(new Vector(0, 4)),
      new Move(new Vector(4, 4)),
      new Move(new Vector(5, 4)),
      new Move(new Vector(6, 4)),
      new Move(new Vector(7, 4)),

      new Move(new Vector(2, 3)),
      new Move(new Vector(1, 2)),
      new Move(new Vector(0, 1)),
      new Move(new Vector(4, 3)),
      new Move(new Vector(5, 2)),
      new Move(new Vector(6, 1)),
      new Move(new Vector(7, 0)),
      new Move(new Vector(2, 5)),
      new Move(new Vector(1, 6)),
      new Move(new Vector(0, 7)),
      new Move(new Vector(4, 5)),
      new Move(new Vector(5, 6)),
      new Move(new Vector(6, 7))
    ]
    )
  }

  expect(movesets['0'].length).toBe(27)
  expect(movesets).toEqual(expected_movesets)
})

test('Knight moveset', () => {
  addToChessboard('knight', 1, 3, 1)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_movesets = {
    '0': expect.arrayContaining([
      new Move(new Vector(1, 0)),
      new Move(new Vector(1, 2)),
      new Move(new Vector(2, 3)),
      new Move(new Vector(4, 3)),
      new Move(new Vector(5, 0)),
      new Move(new Vector(5, 2)),
    ])
  }

  expect(movesets['0'].length).toBe(6)
  expect(movesets).toEqual(expected_movesets)
})

test('Knight moveset blocked by ally', () => {
  addToChessboard('knight', 1, 3, 1)
  addToChessboard('rook', 0, 1, 1)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_moveset = [
    new Move(new Vector(1, 2)),
    new Move(new Vector(2, 3)),
    new Move(new Vector(4, 3)),
    new Move(new Vector(5, 0)),
    new Move(new Vector(5, 2))
  ]
  

  expect(movesets['0'].length).toBe(expected_moveset.length)
  expect(movesets['0']).toEqual(expect.arrayContaining(expected_moveset))
})

test('Knight moveset blocked by enemy', () => {
  addToChessboard('knight', 1, 3, 1)
  addToChessboard('rook', 0, 1, 2)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_moveset = [
    new Move(new Vector(1, 0), chessboard[0][1]),
    new Move(new Vector(1, 2)),
    new Move(new Vector(2, 3)),
    new Move(new Vector(4, 3)),
    new Move(new Vector(5, 0)),
    new Move(new Vector(5, 2))
]


  expect(movesets['0'].length).toBe(expected_moveset.length)
  expect(movesets['0']).toEqual(expect.arrayContaining(expected_moveset))
})

test('Pawn first moveset player 1', () => {
  addToChessboard('pawn', 6, 3, 1)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_movesets = {
    '0': expect.arrayContaining([
      new Move(new Vector(3, 5)),
      new Move(new Vector(3, 4)),
    ])
  }

  expect(movesets['0'].length).toBe(2)
  expect(movesets).toEqual(expected_movesets)
})

test('Pawn first moveset player 2', () => {
  addToChessboard('pawn', 1, 3, 2)
  const movesets = generate_base_movesets(chessboard, 2)

  const expected_movesets = {
    '0': expect.arrayContaining([
      new Move(new Vector(3, 2)),
      new Move(new Vector(3, 3)),
    ])
  }

  expect(movesets['0'].length).toBe(2)
  expect(movesets).toEqual(expected_movesets)
})

test('Pawn cannot move 2 steps forward as first move when blocked by ally', () => {
  addToChessboard('pawn', 6, 3, 1)
  addToChessboard('rook', 4, 3, 1)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_moveset = [
    new Move(new Vector(3, 5)),
  ]

  expect(movesets['0'].length).toBe(expected_moveset.length)
  expect(movesets['0']).toEqual(expect.arrayContaining(expected_moveset))
})

test('Pawn cannot move 2 steps forward as first move when blocked by enemy', () => {
  addToChessboard('pawn', 6, 3, 1)
  addToChessboard('rook', 4, 3, 2)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_moveset = [
    new Move(new Vector(3, 5)),
  ]

  expect(movesets['0'].length).toBe(expected_moveset.length)
  expect(movesets['0']).toEqual(expect.arrayContaining(expected_moveset))
})

test('Pawn can only move 1 step forward after first move', () => {
  addToChessboard('pawn', 6, 3, 1)
  chessboard[6][3].has_moved = true
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_movesets = {
    '0': expect.arrayContaining([
      new Move(new Vector(3, 5)),
    ])
  }

  expect(movesets['0'].length).toBe(1)
  expect(movesets).toEqual(expected_movesets)
})

test('Pawn stuck when blocked by ally', () => {
  addToChessboard('pawn', 6, 3, 1)
  addToChessboard('rook', 5, 3, 1)
  const movesets = generate_base_movesets(chessboard, 1)

  expect(movesets['0'].length).toBe(0)
})

test('Pawn stuck when blocked by enemy', () => {
  addToChessboard('pawn', 6, 3, 1)
  addToChessboard('rook', 5, 3, 2)
  const movesets = generate_base_movesets(chessboard, 1)

  expect(movesets['0'].length).toBe(0)
})

test('Pawn can capture enemies diagonally forward', () => {
  addToChessboard('pawn', 6, 3, 1)
  addToChessboard('rook', 5, 2, 2)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_moveset = [
    new Move(new Vector(3, 5)),
    new Move(new Vector(3, 4)),
    new Move(new Vector(2, 5), chessboard[5][2])
  ]

  expect(movesets['0'].length).toBe(expected_moveset.length)
  expect(movesets['0']).toEqual(expect.arrayContaining(expected_moveset))
})

test('Pawn can en passant', () => {
  addToChessboard('pawn', 3, 5, 1)
  addToChessboard('pawn', 3, 4, 2)
  chessboard[3][4].vulnerable_to_enpassant = true
  chessboard[3][5].has_moved = true

  const movesets = generate_base_movesets(chessboard, 1)
  const expected_moveset = [
    new Move(new Vector(5, 2)),
    new Move(new Vector(4, 2), chessboard[3][4]),
  ]

  expect(movesets['0'].length).toBe(expected_moveset.length)
  expect(movesets['0']).toEqual(expect.arrayContaining(expected_moveset))
})

test('King moveset', () => {
  const y = 7
  const x = 3
  addToChessboard('king', y, x, 1)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_movesets = {
    '0': expect.arrayContaining([
      new Move(new Vector(x-1, y-1)),
      new Move(new Vector(x, y-1)),
      new Move(new Vector(x+1, y-1)),
      new Move(new Vector(x+1, y)),
      new Move(new Vector(x-1, y)),
    ])
  }

  expect(movesets['0'].length).toBe(5)
  expect(movesets).toEqual(expected_movesets)
})

test('King moveset blocked by ally', () => {
  const y = 7
  const x = 3
  addToChessboard('king', y, x, 1)
  addToChessboard('rook', 7, 2, 1)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_moveset = [
    new Move(new Vector(x-1, y-1)),
    new Move(new Vector(x, y-1)),
    new Move(new Vector(x+1, y-1)),
    new Move(new Vector(x+1, y)),
  ]

  expect(movesets['0'].length).toBe(expected_moveset.length)
  expect(movesets['0']).toEqual(expect.arrayContaining(expected_moveset))
})

test('King moveset blocked by enemy', () => {
  const y = 7
  const x = 3
  addToChessboard('king', y, x, 1)
  addToChessboard('rook', 7, 2, 2)
  const movesets = generate_base_movesets(chessboard, 1)

  const expected_moveset = [
    new Move(new Vector(x-1, y-1)),
    new Move(new Vector(x, y-1)),
    new Move(new Vector(x+1, y-1)),
    new Move(new Vector(x+1, y)),
    new Move(new Vector(x-1, y), chessboard[7][2]),
  ]

  expect(movesets['0'].length).toBe(expected_moveset.length)
  expect(movesets['0']).toEqual(expect.arrayContaining(expected_moveset))
})


function addToChessboard(type, y, x, player) {
  const n_pieces = chessboard.flat().reduce((count, piece) => {
    return piece === null ? count : count + 1
  }, 0)

  const piece = {
    player: player,
    _pos: {x: x, y: y},
    pos: {x: x, y: y},  // needed to fake Chesspiece getter method
    move_type: type,
    id: n_pieces.toString()
  }

  chessboard[y][x] = piece
}
