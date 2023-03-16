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

describe('Castling white side', () => {
    let chessboard = new Chessboard()
    const castlingMove1 = {
        pos: {x: 2, y: 7},
        capture: null
    }
    const castlingMove2 = {
        pos: {x: 6, y: 7},
        capture: null
    }
    
    beforeEach(() => {
        chessboard = new Chessboard()
        chessboard.add_rook(1, new Vector(0, 7), 'wrook1')
        chessboard.add_rook(1, new Vector(7, 7), 'wrook2')
        chessboard.add_king(1, new Vector(4, 7), 'wking')
    })

    test('Castling move is possible', () => {
        const moveManager = new MoveManager(chessboard)
        const moves = moveManager.compute_moves(1)
        
        expect(moves['wking']).toContainEqual(castlingMove1)
        expect(moves['wking']).toContainEqual(castlingMove2)
    })

    test('No castling if rook has moved before', () => {
        const moveManager = new MoveManager(chessboard)
        moveManager.move_piece('wrook1', new Vector(1, 7), 1)
        moveManager.move_piece('wrook1', new Vector(0, 7), 1)
        const moves = moveManager.compute_moves(1)

        expect(moves['wking']).not.toContainEqual(castlingMove1)
    })
    
    test('No castling if king has moved before', () => {
        const moveManager = new MoveManager(chessboard)
        moveManager.move_piece('wking', new Vector(4, 6), 1)
        moveManager.move_piece('wking', new Vector(4, 7), 1)
        const moves = moveManager.compute_moves(1)

        expect(moves['wking']).not.toContainEqual(castlingMove1)
    })
    
    test('No castling if something between king and rook', () => {
        chessboard.add_knight(1, new Vector(1, 7), 'wknight1')
        const moveManager = new MoveManager(chessboard)
        const moves = moveManager.compute_moves(1)

        expect(moves['wking']).not.toContainEqual(castlingMove1)
    })
    
    test('No castling if king is under check', () => {
        chessboard.add_rook(2, new Vector(4, 0), 'brook1')
        const moveManager = new MoveManager(chessboard)
        const moves = moveManager.compute_moves(1)

        expect(moves['wking']).not.toContainEqual(castlingMove1)
    })
})


describe('Castling black side', () => {
    let chessboard = new Chessboard()
    const castlingMove1 = {
        pos: {x: 2, y: 0},
        capture: null
    }
    const castlingMove2 = {
        pos: {x: 6, y: 0},
        capture: null
    }
    
    beforeEach(() => {
        chessboard = new Chessboard()
        chessboard.add_rook(2, new Vector(0, 0), 'brook1')
        chessboard.add_rook(2, new Vector(7, 0), 'brook2')
        chessboard.add_king(2, new Vector(4, 0), 'bking')
    })

    test('Castling move is possible', () => {
        const moveManager = new MoveManager(chessboard)
        const moves = moveManager.compute_moves(2)
        
        expect(moves['bking']).toContainEqual(castlingMove1)
        expect(moves['bking']).toContainEqual(castlingMove2)
    })

    test('No castling if rook has moved before', () => {
        const moveManager = new MoveManager(chessboard)
        moveManager.move_piece('brook1', new Vector(1, 0), 2)
        moveManager.move_piece('brook1', new Vector(0, 0), 2)
        const moves = moveManager.compute_moves(2)

        expect(moves['bking']).not.toContainEqual(castlingMove1)
    })
    
    test('No castling if king has moved before', () => {
        const moveManager = new MoveManager(chessboard)
        moveManager.move_piece('bking', new Vector(4, 1), 2)
        moveManager.move_piece('bking', new Vector(4, 0), 2)
        const moves = moveManager.compute_moves(2)

        expect(moves['bking']).not.toContainEqual(castlingMove1)
    })
    
    test('No castling if something between king and rook', () => {
        chessboard.add_knight(2, new Vector(1, 0), 'bknight1')
        const moveManager = new MoveManager(chessboard)
        const moves = moveManager.compute_moves(2)

        expect(moves['bking']).not.toContainEqual(castlingMove1)
    })
    
    test('No castling if king is under check', () => {
        chessboard.add_rook(1, new Vector(4, 7), 'wrook1')
        const moveManager = new MoveManager(chessboard)
        const moves = moveManager.compute_moves(2)

        expect(moves['bking']).not.toContainEqual(castlingMove1)
    })
})
