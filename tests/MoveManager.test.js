const MoveManager = require('../chess/MoveManager')
const Chessboard = require('../chess/Chessboard')
const Vector = require('../chess/Position');


test('Attempt to move non-existent chess piece should fail', () => {
    const chessboard = new Chessboard()
    chessboard.init()
    const moveManager = new MoveManager(chessboard)

    const chessboardRef = Chessboard.clone(chessboard)
    const success = moveManager.move_piece('non-existent id', new Vector(0, 5), 1)
    expect(success).toBe(false)
    expect(chessboard).toEqual(chessboardRef)
})

test('Attempt to move valid chess piece should succeed', () => {
    const chessboard = new Chessboard()
    chessboard.init()
    const moveManager = new MoveManager(chessboard)

    const chessboardRef = Chessboard.clone(chessboard)
    const pawn = chessboardRef.chessboard[6][0]
    pawn.pos = new Vector(0, 5)
    chessboardRef.chessboard[5][0] = chessboardRef.chessboard[6][0]
    chessboardRef.chessboard[6][0] = null

    const success = moveManager.move_piece(pawn.id, new Vector(0, 5), 1)
    expect(success).toBe(true)
    expect(chessboard).toEqual(chessboardRef)
})
