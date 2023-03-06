const Chessboard = require('./Chessboard')
const MoveManager = require('./MoveManager')
const Vector = require('./Position')


function newGame() {
    const chessboard = new Chessboard()
    chessboard.init()
    const moveManager = new MoveManager(chessboard)

    const gameStateNew = createNextGameState(chessboard, moveManager, 1)
    return gameStateNew
}


function execMoveInGame(gameState, id, x, y) {
    const chessboard = new Chessboard(gameState.chesspieces1, gameState.chesspieces2, gameState.graveyard)
    const moveManager = new MoveManager(chessboard)
    const success = moveManager.move_piece(id, new Vector(x, y), gameState.player_turn)

    if (success) {
        const nextPlayerTurn = gameState.player_turn % 2 + 1
        const gameStateNew = createNextGameState(chessboard, moveManager, nextPlayerTurn)
        return gameStateNew
    }
    else {
        return null
    }
}


function createNextGameState(chessboard, moveManager, nextPlayerTurn) {
    const gameStateNew = {}
    gameStateNew.chesspieces1 = chessboard.chesspieces1
    gameStateNew.chesspieces2 = chessboard.chesspieces2
    gameStateNew.graveyard = chessboard.graveyard

    gameStateNew.nextPlayerTurn = nextPlayerTurn
    const nextMoves = moveManager.compute_moves(nextPlayerTurn)
    gameStateNew.moves = nextMoves

    const king_is_threatened = chessboard.kingIsThreatened(nextPlayerTurn)
    const hasLegalMoves = Object.keys(nextMoves).length > 0

    if (king_is_threatened && hasLegalMoves) {
        gameStateNew.check = true
    }
    else if (king_is_threatened && !hasLegalMoves) {
        gameStateNew.checkmate = true
    }
    else if (!king_is_threatened && !hasLegalMoves) {
        gameStateNew.stalemate = true
    }

    return gameStateNew
}


module.exports = {newGame, execMoveInGame}