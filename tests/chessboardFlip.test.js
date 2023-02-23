import {flipBoard, flipMoves} from "../public/chessboardFlip"


test("Flip chessboard", () => {
    const chessboard = new Array(8);
    for (let i = 0; i < 8; i++) {
        chessboard[i] = new Array(8).fill(null);
    }

    chessboard[0][3] = 'chesspiece'
    chessboard[5][1] = 'chesspiece2'
    
    const chessboardExpect = new Array(8);
    for (let i = 0; i < 8; i++) {
        chessboardExpect[i] = new Array(8).fill(null);
    }

    chessboardExpect[7][4] = 'chesspiece'
    chessboardExpect[2][6] = 'chesspiece2'

    const flippedChessboard = flipBoard(chessboard)
    expect(flippedChessboard).toEqual(chessboardExpect)
})


test("Flip moves", () => {
    const moves = {
        'id1': [{pos: {x: 3, y: 0}, capture: null}],
        'id2': [{pos: {x: 1, y: 5}, capture: 'id3'}, {pos: {x: 2, y: 5}, capture: null}]
    }

    const flippedMoves = flipMoves(moves)

    const movesExpect = {
        'id1': [{pos: {x: 4, y: 7}, capture: null}],
        'id2': [{pos: {x: 6, y: 2}, capture: 'id3'}, {pos: {x: 5, y: 2}, capture: null}]
    }

    expect(flippedMoves).toEqual(movesExpect)
})