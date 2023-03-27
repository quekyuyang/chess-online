class GameState {
    constructor(gameData) {
        this.chesspieces1 = gameData.chesspieces1
        this.chesspieces2 = gameData.chesspieces2
        this.graveyard = gameData.graveyard
        this.moves = gameData.moves
    }

    movePiece(id, x, y) {
        const chesspiece = this.findPiece(id)
        chesspiece._pos.x = x
        chesspiece._pos.y = y
        
        const move = this.moves[id].find(move => move.pos.x == x && move.pos.y == y)
        if (move && move.capture) {
            this.graveyard.push(move.capture)
        }

        if (move && move.castlingPartner) {
            const castlingPartnerPiece = this.findPiece(move.castlingPartner.id)
            castlingPartnerPiece._pos.x = move.castlingPartner.move.pos.x
            castlingPartnerPiece._pos.y = move.castlingPartner.move.pos.y
        }
    }

    findPiece(id) {
        let chesspiece = this.chesspieces1.find(chesspiece => chesspiece.id == id)
        if (!chesspiece) {
            chesspiece = this.chesspieces2.find(chesspiece => chesspiece.id == id)
        }
        return chesspiece
    }
}


export {GameState}