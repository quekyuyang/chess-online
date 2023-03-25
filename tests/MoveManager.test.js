const MoveManager = require('../chess/MoveManager')
const Chessboard = require('../chess/Chessboard')
const Vector = require('../chess/Position')
const Move = require('../chess/Move')


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
    
    const wking_id = 'wking'
    const wrook_id1 = 'wrook1'
    const wrook_id2 = 'wrook2'
    
    beforeEach(() => {
        chessboard = new Chessboard()
        chessboard.add_rook(1, new Vector(0, 7), wrook_id1)
        chessboard.add_rook(1, new Vector(7, 7), wrook_id2)
        chessboard.add_king(1, new Vector(4, 7), wking_id)
    })

    test('Castling move is possible', () => {
        const moveManager = new MoveManager(chessboard)
        const moves = moveManager.compute_moves(1)

        const castlingMove1 = moves[wking_id].find(move => move.pos.x == 2)
        const castlingMove2 = moves[wking_id].find(move => move.pos.x == 6)
        expect(castlingMove1.castlingPartner.id).toBe(wrook_id1)
        expect(castlingMove1.castlingPartner.move).toEqual(new Move(new Vector(3, 7)))
        expect(castlingMove2.castlingPartner.id).toBe(wrook_id2)
        expect(castlingMove2.castlingPartner.move).toEqual(new Move(new Vector(5, 7)))
    })

    test('No castling if rook has moved before', () => {
        const moveManager = new MoveManager(chessboard)
        moveManager.move_piece(wrook_id1, new Vector(1, 7), 1)
        moveManager.move_piece(wrook_id1, new Vector(0, 7), 1)
        const moves = moveManager.compute_moves(1)

        expect(moves[wking_id]).not.toContainEqual(expect.objectContaining({
            pos: new Vector(2, 7)
        }))
    })
    
    test('No castling if king has moved before', () => {
        const moveManager = new MoveManager(chessboard)
        moveManager.move_piece(wking_id, new Vector(4, 6), 1)
        moveManager.move_piece(wking_id, new Vector(4, 7), 1)
        const moves = moveManager.compute_moves(1)

        expect(moves[wking_id]).not.toContainEqual(expect.objectContaining({
            pos: new Vector(2, 7)
        }))
        expect(moves[wking_id]).not.toContainEqual(expect.objectContaining({
            pos: new Vector(6, 7)
        }))
    })
    
    test('No castling if something between king and rook', () => {
        chessboard.add_knight(1, new Vector(1, 7), 'wknight1')
        const moveManager = new MoveManager(chessboard)
        const moves = moveManager.compute_moves(1)

        expect(moves[wking_id]).not.toContainEqual(expect.objectContaining({
            pos: new Vector(2, 7)
        }))
    })
    
    test('No castling if king is under check', () => {
        chessboard.add_rook(2, new Vector(4, 0), 'brook1')
        const moveManager = new MoveManager(chessboard)
        const moves = moveManager.compute_moves(1)

        expect(moves[wking_id]).not.toContainEqual(expect.objectContaining({
            pos: new Vector(2, 7)
        }))
        expect(moves[wking_id]).not.toContainEqual(expect.objectContaining({
            pos: new Vector(6, 7)
        }))
    })

    test('Execute castling move with rook1', () => {
        const moveManager = new MoveManager(chessboard)
        const king = chessboard.chessboard[7][4]
        const rook1 = chessboard.chessboard[7][0]
        moveManager.move_piece(wking_id, new Vector(2, 7), 1)
        
        expect(chessboard.chessboard[7][2]).toBe(king)
        expect(chessboard.chessboard[7][3]).toBe(rook1)
    })

    test('Execute castling move with rook2', () => {
        const moveManager = new MoveManager(chessboard)
        const king = chessboard.chessboard[7][4]
        const rook2 = chessboard.chessboard[7][7]
        moveManager.move_piece(wking_id, new Vector(6, 7), 1)

        expect(chessboard.chessboard[7][6]).toBe(king)
        expect(chessboard.chessboard[7][5]).toBe(rook2)
    })

    test('Do not execute castling if king has moved before', () => {
        const moveManager = new MoveManager(chessboard)
        const rook2 = chessboard.chessboard[7][7]
        moveManager.move_piece(wking_id, new Vector(5, 7), 1)
        moveManager.move_piece(wking_id, new Vector(6, 7), 1)

        expect(chessboard.chessboard[7][5]).not.toBe(rook2)
        expect(chessboard.chessboard[7][7]).toBe(rook2)
    })
})


describe('Castling black side', () => {
    let chessboard = new Chessboard()

    const bking_id = 'bking'
    const brook_id1 = 'brook1'
    const brook_id2 = 'brook2'
    
    beforeEach(() => {
        chessboard = new Chessboard()
        chessboard.add_rook(2, new Vector(0, 0), brook_id1)
        chessboard.add_rook(2, new Vector(7, 0), brook_id2)
        chessboard.add_king(2, new Vector(4, 0), bking_id)
    })

    test('Castling move is possible', () => {
        const moveManager = new MoveManager(chessboard)
        const moves = moveManager.compute_moves(2)
        
        const castlingMove1 = moves[bking_id].find(move => move.pos.x == 2)
        const castlingMove2 = moves[bking_id].find(move => move.pos.x == 6)
        expect(castlingMove1.castlingPartner.id).toBe(brook_id1)
        expect(castlingMove1.castlingPartner.move).toEqual(new Move(new Vector(3, 0)))
        expect(castlingMove2.castlingPartner.id).toBe(brook_id2)
        expect(castlingMove2.castlingPartner.move).toEqual(new Move(new Vector(5, 0)))
    })

    test('No castling if rook has moved before', () => {
        const moveManager = new MoveManager(chessboard)
        moveManager.move_piece(brook_id1, new Vector(1, 0), 2)
        moveManager.move_piece(brook_id1, new Vector(0, 0), 2)
        const moves = moveManager.compute_moves(2)

        expect(moves[bking_id]).not.toContainEqual(expect.objectContaining({
            pos: new Vector(2, 0)
        }))
    })
    
    test('No castling if king has moved before', () => {
        const moveManager = new MoveManager(chessboard)
        moveManager.move_piece(bking_id, new Vector(4, 1), 2)
        moveManager.move_piece(bking_id, new Vector(4, 0), 2)
        const moves = moveManager.compute_moves(2)

        expect(moves[bking_id]).not.toContainEqual(expect.objectContaining({
            pos: new Vector(2, 0)
        }))
        expect(moves[bking_id]).not.toContainEqual(expect.objectContaining({
            pos: new Vector(6, 0)
        }))
    })
    
    test('No castling if something between king and rook', () => {
        chessboard.add_knight(2, new Vector(1, 0), 'bknight1')
        const moveManager = new MoveManager(chessboard)
        const moves = moveManager.compute_moves(2)

        expect(moves[bking_id]).not.toContainEqual(expect.objectContaining({
            pos: new Vector(2, 0)
        }))
    })
    
    test('No castling if king is under check', () => {
        chessboard.add_rook(1, new Vector(4, 7), 'wrook1')
        const moveManager = new MoveManager(chessboard)
        const moves = moveManager.compute_moves(2)

        expect(moves[bking_id]).not.toContainEqual(expect.objectContaining({
            pos: new Vector(2, 0)
        }))
    })
    
    test('Execute castling move with rook1', () => {
        const moveManager = new MoveManager(chessboard)
        const king = chessboard.chessboard[0][4]
        const rook1 = chessboard.chessboard[0][0]
        moveManager.move_piece(bking_id, new Vector(2, 0), 2)
        
        expect(chessboard.chessboard[0][2]).toBe(king)
        expect(chessboard.chessboard[0][3]).toBe(rook1)
    })

    test('Execute castling move with rook2', () => {
        const moveManager = new MoveManager(chessboard)
        const king = chessboard.chessboard[0][4]
        const rook2 = chessboard.chessboard[0][7]
        moveManager.move_piece(bking_id, new Vector(6, 0), 2)

        expect(chessboard.chessboard[0][6]).toBe(king)
        expect(chessboard.chessboard[0][5]).toBe(rook2)
    })
})
