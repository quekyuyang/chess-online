const MoveManager = require('../chess/MoveManager')
const generate_base_movesets = require('../chess/base_moveset')
jest.mock('../chess/base_moveset')


generate_base_movesets.mockReturnValue({
  pawn1: [{pos: {x: 5, y: 2, equals: () => true}}]
})

test('MoveManager should pass chess pieces to moveset generator', () => {
  const chessboard = {}
  chessboard.chessboard = new Array(8)
  for (let i = 0; i < 8; i++) {
    chessboard.chessboard[i] = new Array(8).fill(null)
  }

  const pawn1 = {
    pos: {x: 4, y: 3},
    id: 'pawn1',
    player: 1,
    vulnerable_to_enpassant: false
  }
  const pawn2 = {
    pos: {x: 5, y: 3},
    id: 'pawn2',
    player: 2,
    vulnerable_to_enpassant: true
  }

  // Fake Chessboard object
  chessboard.chessboard[3][4] = pawn1
  chessboard.chessboard[3][5] = pawn2
  chessboard.chesspieces1 = [pawn1]
  chessboard.chesspieces2 = [pawn2]
  chessboard.move_piece = jest.fn()

  const move_manager = new MoveManager(chessboard)
  const success = move_manager.move_piece(pawn1.id, {x: 5, y: 2}, 1)

  expect(success).toBe(true)
  expect(generate_base_movesets.mock.calls.length).toBe(1)
  expect(generate_base_movesets.mock.calls[0][0][3][4]).toBe(pawn1)
  expect(generate_base_movesets.mock.calls[0][0][3][5]).toBe(pawn2)
})
