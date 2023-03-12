const MoveManager = require('../chess/MoveManager')
const Chessboard = require('../chess/Chessboard')
const {Rook} = require('../chess/ChessPiece')
const filterMoves = require('../chess/filterMoves')
const Vector = require('../chess/Position');
const Move = require('../chess/Move')


jest.mock('../chess/Chessboard')
jest.mock('../chess/base_moveset')
jest.mock('../chess/filterMoves')

test('Attempt to move non-existant chess piece should return fail', () => {
    const chessboard = new Chessboard()
    chessboard.chesspieces1 = []
    const moveManager = new MoveManager(chessboard)

    const pos = {x: 0, y: 3}
    const success = moveManager.move_piece('id1', pos, 1)
    expect(success).toBe(false)
    expect(chessboard.move_piece).not.toHaveBeenCalled()
})

test('Attempt to execute valid move should succeed', () => {
    const chessboard = new Chessboard()
    const chesspiece = new Rook(1, 3, 1, 'id1')
    chessboard.chesspieces1 = [chesspiece]
    const moveManager = new MoveManager(chessboard)

    const dest = new Vector(0, 3)
    const move = new Move(dest)

    filterMoves.mockReturnValue({
        'id1': [move]
    })

    const success = moveManager.move_piece('id1', dest, 1)
    expect(success).toBe(true)
    expect(chessboard.move_piece).toHaveBeenCalledWith(chesspiece.pos.y, chesspiece.pos.x, move)
})

test('Attempt to execute invalid move should return fail', () => {
    const chessboard = new Chessboard()
    const chesspiece = new Rook(1, 3, 1, 'id1')
    chessboard.chesspieces1 = [chesspiece]
    const moveManager = new MoveManager(chessboard)

    const dest = new Vector(0, 3)
    const move = new Move(dest)

    filterMoves.mockReturnValue({
        'id1': [move]
    })

    const invalidDest = new Vector(1, 3)
    const success = moveManager.move_piece('id1', invalidDest, 1)
    expect(success).toBe(false)
    expect(chessboard.move_piece).not.toHaveBeenCalled()
})
