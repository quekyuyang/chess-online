class Move {
    constructor(pos, capture = null, castlingPartner = null) {
        this.pos = pos
        this.capture = capture
        this.castlingPartner = castlingPartner
    }
}


module.exports = Move
