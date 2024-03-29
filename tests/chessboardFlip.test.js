import {flipPositions} from "../public/chessboardFlip"


test("Flip chesspiece positions but no moves", () => {
    const chesspieces1 = [
        {_pos: {x: 3, y: 0}}
    ]

    const chesspieces2 = [
        {_pos: {x: 1, y: 5}}
    ]

    const gameState = {chesspieces1: chesspieces1, chesspieces2: chesspieces2}
    flipPositions(gameState)
    expect(gameState.chesspieces1[0]._pos).toEqual({x: 4, y: 7})
    expect(gameState.chesspieces2[0]._pos).toEqual({x: 6, y: 2})
})


test("Flip chesspiece positions and moves", () => {
    const moves = {
        'id1': [{pos: {x: 3, y: 0}, capture: null}],
        'id2': [{pos: {x: 1, y: 5}, capture: 'id3'}, {pos: {x: 2, y: 5}, capture: null}]
    }

    const chesspieces1 = [
        {_pos: {x: 3, y: 0}}
    ]

    const chesspieces2 = [
        {_pos: {x: 1, y: 5}}
    ]

    const gameState = {
        chesspieces1: chesspieces1,
        chesspieces2: chesspieces2,
        moves: moves
    }

    flipPositions(gameState)

    const movesExpect = {
        'id1': [{pos: {x: 4, y: 7}, capture: null}],
        'id2': [{pos: {x: 6, y: 2}, capture: 'id3'}, {pos: {x: 5, y: 2}, capture: null}]
    }

    expect(gameState.chesspieces1[0]._pos).toEqual({x: 4, y: 7})
    expect(gameState.chesspieces2[0]._pos).toEqual({x: 6, y: 2})
    expect(gameState.moves).toEqual(movesExpect)
})
