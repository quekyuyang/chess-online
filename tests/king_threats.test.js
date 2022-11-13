const find_king_threats = require('../chess/king_threats')


var chessboard;
beforeEach(() => {
  chessboard = new Array(8)
  for (let i = 0; i < 8; i++) {
    chessboard[i] = new Array(8).fill(null)
  }
})


describe('King theatened by rook', () => {
  let king
  beforeEach(() => {
    king = addToChessboard('king', 4, 4, 1)
  })

  test('Enemy rook left of king', () => {
    const rook = addToChessboard('rook', 1, 4, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(rook)
  })

  test('Enemy rook right of king', () => {
    const rook = addToChessboard('rook', 6, 4, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(rook)
  })

  test('Enemy rook above king', () => {
    const rook = addToChessboard('rook', 4, 7, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(rook)
  })

  test('Enemy rook below king', () => {
    const rook = addToChessboard('rook', 4, 3, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(rook)
  })
})


describe('King theatened by queen', () => {
  let king
  beforeEach(() => {
    king = addToChessboard('king', 4, 4, 1)
  })

  test('Enemy queen left of king', () => {
    const queen = addToChessboard('queen', 1, 4, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(queen)
  })

  test('Enemy queen right of king', () => {
    const queen = addToChessboard('queen', 6, 4, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(queen)
  })

  test('Enemy queen above king', () => {
    const queen = addToChessboard('queen', 4, 7, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(queen)
  })

  test('Enemy queen below king', () => {
    const queen = addToChessboard('queen', 4, 3, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(queen)
  })

  test('Enemy queen right above king', () => {
    const queen = addToChessboard('queen', 6, 2, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(queen)
  })

  test('Enemy queen right below king', () => {
    const queen = addToChessboard('queen', 5, 5, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(queen)
  })

  test('Enemy queen left below king', () => {
    const queen = addToChessboard('queen', 1, 7, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(queen)
  })

  test('Enemy queen left above king', () => {
    const queen = addToChessboard('queen', 2, 2, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(queen)
  })
})


describe('King theatened by bishop', () => {
  let king
  beforeEach(() => {
    king = addToChessboard('king', 4, 4, 1)
  })

  test('Enemy bishop right above king', () => {
    const bishop = addToChessboard('bishop', 6, 2, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(bishop)
  })

  test('Enemy bishop right below king', () => {
    const bishop = addToChessboard('bishop', 5, 5, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(bishop)
  })

  test('Enemy bishop left below king', () => {
    const bishop = addToChessboard('bishop', 1, 7, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(bishop)
  })

  test('Enemy bishop left above king', () => {
    const bishop = addToChessboard('bishop', 2, 2, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(bishop)
  })
})


describe('King threatened by knight', () => {
  let king
  beforeEach(() => {
    king = addToChessboard('king', 4, 4, 1)
  })

  test('Case 1', () => {
    const knight = addToChessboard('knight', 2, 3, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(knight)
  })

  test('Case 2', () => {
    const knight = addToChessboard('knight', 3, 2, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(knight)
  })

  test('Case 3', () => {
    const knight = addToChessboard('knight', 5, 2, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(knight)
  })

  test('Case 4', () => {
    const knight = addToChessboard('knight', 6, 3, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(knight)
  })

  test('Case 5', () => {
    const knight = addToChessboard('knight', 6, 5, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(knight)
  })

  test('Case 6', () => {
    const knight = addToChessboard('knight', 5, 6, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(knight)
  })

  test('Case 7', () => {
    const knight = addToChessboard('knight', 3, 6, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(knight)
  })

  test('Case 8', () => {
    const knight = addToChessboard('knight', 2, 5, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(knight)
  })
})


describe('King threatened by pawn', () => {
  test('Black pawn left above white king', () => {
    const king = addToChessboard('king', 4, 4, 1)
    const pawn = addToChessboard('pawn', 3, 3, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(pawn)
  })

  test('Black pawn right above white king', () => {
    const king = addToChessboard('king', 4, 4, 1)
    const pawn = addToChessboard('pawn', 5, 3, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(pawn)
  })

  test('Black pawn below white king is not a threat', () => {
    const king = addToChessboard('king', 4, 4, 1)
    const pawn = addToChessboard('pawn', 5, 5, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
  })

  test('White pawn left below black king', () => {
    const king = addToChessboard('king', 4, 4, 2)
    const pawn = addToChessboard('pawn', 3, 5, 1)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(pawn)
  })

  test('White pawn right below black king', () => {
    const king = addToChessboard('king', 4, 4, 2)
    const pawn = addToChessboard('pawn', 5, 5, 1)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(1)
    expect(threats[0]).toBe(pawn)
  })

  test('White pawn above black king is not a threat', () => {
    const king = addToChessboard('king', 4, 4, 2)
    const pawn = addToChessboard('pawn', 5, 3, 1)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
  })
})


describe('Chesspiece pinned by queen', () => {
  let king
  beforeEach(() => {
    king = addToChessboard('king', 4, 4, 1)
  })

  test('Pinned to the left of king', () => {
    const rook = addToChessboard('rook', 2, 4, 1)
    const queen = addToChessboard('queen', 0, 4, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(rook)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pinned to the right of king', () => {
    const rook = addToChessboard('rook', 5, 4, 1)
    const queen = addToChessboard('queen', 6, 4, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(rook)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pinned above king', () => {
    const rook = addToChessboard('rook', 4, 1, 1)
    const queen = addToChessboard('queen', 4, 0, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(rook)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pinned below king', () => {
    const rook = addToChessboard('rook', 4, 6, 1)
    const queen = addToChessboard('queen', 4, 7, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(rook)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pinned to the upper right of king', () => {
    const rook = addToChessboard('rook', 5, 3, 1)
    const queen = addToChessboard('queen', 6, 2, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(rook)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pinned to the lower right of king', () => {
    const rook = addToChessboard('rook', 5, 5, 1)
    const queen = addToChessboard('queen', 6, 6, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(rook)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pinned to the lower left of king', () => {
    const rook = addToChessboard('rook', 3, 5, 1)
    const queen = addToChessboard('queen', 1, 7, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(rook)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pinned to the upper left of king', () => {
    const rook = addToChessboard('rook', 2, 2, 1)
    const queen = addToChessboard('queen', 0, 0, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(rook)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })
})


describe('En passant pin', () => {
  // These don't test en passant at feasible positions.
  // It instead forces en passant for convenience

  // In this context, pin means restricted from executing en passant
  // Pawn can still execute other moves when 'pinned'

  let king
  beforeEach(() => {
    king = addToChessboard('king', 4, 4, 1)
  })

  test('Pawn pinned to the left of king, case 1', () => {
    const pawn_ally = addToChessboard('pawn', 3, 4, 1)
    const pawn_enemy = addToChessboard('pawn', 2, 4, 2)
    pawn_enemy.vulnerable_to_enpassant = true
    const queen = addToChessboard('queen', 0, 4, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(pawn_ally)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pawn pinned to the left of king, case 2', () => {
    const pawn_ally = addToChessboard('pawn', 2, 4, 1)
    const pawn_enemy = addToChessboard('pawn', 3, 4, 2)
    pawn_enemy.vulnerable_to_enpassant = true
    const queen = addToChessboard('queen', 0, 4, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(pawn_ally)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pawn pinned to the right of king, case 1', () => {
    const pawn_ally = addToChessboard('pawn', 5, 4, 1)
    const pawn_enemy = addToChessboard('pawn', 6, 4, 2)
    pawn_enemy.vulnerable_to_enpassant = true
    const queen = addToChessboard('queen', 7, 4, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(pawn_ally)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pawn pinned to the right of king, case 2', () => {
    const pawn_ally = addToChessboard('pawn', 6, 4, 1)
    const pawn_enemy = addToChessboard('pawn', 5, 4, 2)
    pawn_enemy.vulnerable_to_enpassant = true
    const queen = addToChessboard('queen', 7, 4, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(pawn_ally)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pawn not pinned if en passant not possible', () => {
    const pawn_ally = addToChessboard('pawn', 6, 4, 1)
    const pawn_enemy = addToChessboard('pawn', 5, 4, 2)
    pawn_enemy.vulnerable_to_enpassant = false
    const queen = addToChessboard('queen', 7, 4, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(0)
  })
})

describe('En passant pin diagonal', () => {
  // These don't test en passant at feasible positions.
  // It instead forces en passant for convenience

  // In this context, pin means restricted from executing en passant
  // Pawn can still execute other moves when 'pinned'

  let king
  beforeEach(() => {
    king = addToChessboard('king', 4, 5, 1)
  })

  test('Pawn pinned to the upper right of king, case 1', () => {
    const pawn_ally = addToChessboard('pawn', 5, 3, 1)
    const pawn_enemy = addToChessboard('pawn', 6, 3, 2)
    pawn_enemy.vulnerable_to_enpassant = true
    const queen = addToChessboard('queen', 7, 2, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(pawn_ally)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pawn pinned to the upper right of king, case 2', () => {
    const pawn_ally = addToChessboard('pawn', 7, 3, 1)
    const pawn_enemy = addToChessboard('pawn', 6, 3, 2)
    pawn_enemy.vulnerable_to_enpassant = true
    const queen = addToChessboard('queen', 7, 2, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(pawn_ally)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pawn pinned to the lower right of king, case 1', () => {
    const pawn_ally = addToChessboard('pawn', 4, 6, 1)
    const pawn_enemy = addToChessboard('pawn', 5, 6, 2)
    pawn_enemy.vulnerable_to_enpassant = true
    const queen = addToChessboard('queen', 6, 7, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(pawn_ally)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pawn pinned to the lower right of king, case 2', () => {
    const pawn_ally = addToChessboard('pawn', 6, 6, 1)
    const pawn_enemy = addToChessboard('pawn', 5, 6, 2)
    pawn_enemy.vulnerable_to_enpassant = true
    const queen = addToChessboard('queen', 6, 7, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(pawn_ally)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pawn pinned to the lower left of king, case 1', () => {
    const pawn_ally = addToChessboard('pawn', 2, 6, 1)
    const pawn_enemy = addToChessboard('pawn', 3, 6, 2)
    pawn_enemy.vulnerable_to_enpassant = true
    const queen = addToChessboard('queen', 2, 7, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(pawn_ally)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pawn pinned to the lower left of king, case 2', () => {
    const pawn_ally = addToChessboard('pawn', 4, 6, 1)
    const pawn_enemy = addToChessboard('pawn', 3, 6, 2)
    pawn_enemy.vulnerable_to_enpassant = true
    const queen = addToChessboard('queen', 2, 7, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(pawn_ally)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pawn pinned to the upper left of king, case 1', () => {
    const pawn_ally = addToChessboard('pawn', 1, 3, 1)
    const pawn_enemy = addToChessboard('pawn', 2, 3, 2)
    pawn_enemy.vulnerable_to_enpassant = true
    const queen = addToChessboard('queen', 0, 1, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(pawn_ally)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })

  test('Pawn pinned to the upper left of king, case 2', () => {
    const pawn_ally = addToChessboard('pawn', 3, 3, 1)
    const pawn_enemy = addToChessboard('pawn', 2, 3, 2)
    pawn_enemy.vulnerable_to_enpassant = true
    const queen = addToChessboard('queen', 0, 1, 2)
    const [threats, pins] = find_king_threats(king, chessboard)

    expect(threats.length).toBe(0)
    expect(pins.length).toBe(1)
    expect(pins[0].pinned).toBe(pawn_ally)
    expect(pins[0].pinning).toBe(queen)
    expect(pins[0].king).toBe(king)
  })
})


function addToChessboard(type, x, y, player) {
  const piece = {
    player: player,
    pos: {x: x, y: y},  // needed to fake Chesspiece getter method
    move_type: type,
  }

  chessboard[y][x] = piece
  return piece
}
