const MoveManager = require('../chess/MoveManager')
const Chessboard = require('../chess/Chessboard')
const {Rook} = require('../chess/ChessPiece')
const filterMoves = require('../chess/filterMoves')


jest.mock('../chess/Chessboard')
jest.mock('../chess/Chesspiece')
jest.mock('../chess/base_moveset')
jest.mock('../chess/filterMoves')

test('MoveManager move piece', () => {
    const chessboard = new Chessboard()
    chessboard.chesspieces1 = []
    const moveManager = new MoveManager(chessboard)

    const pos = {x: 0, y: 3}

    filterMoves.mockReturnValue({
        'id1': [{pos: pos}]
    })

    const success = moveManager.move_piece('id1', pos, 1)
    expect(success).toBe(false)
})
