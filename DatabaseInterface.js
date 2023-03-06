const { ObjectId } = require("mongodb")
const {get_matches_mongodb} = require("./mongodb.js")


class DatabaseInterface {
  constructor() {
    this.matches = get_matches_mongodb(
      `mongodb+srv://user1:${process.env.MONGOOSE_PASS}\
@cluster0.sloa7os.mongodb.net/?retryWrites=true&w=majority`)
    this.pending_match_ids = new Set()
  }

  newMatch(gameState, player1, player2) {
    const match_id = ObjectId()
    const match = {
      _id: match_id,
      chesspieces1: gameState.chesspieces1,
      chesspieces2: gameState.chesspieces2,
      graveyard: gameState.graveyard,
      player_ids: [player1, player2],
      player_turn: 1
    }

    return this.matches.insertOne(match)
    .then(() => match_id.toString())
  }

  findMatch(match_id) {
    return this.matches.findOne({_id: ObjectId(match_id)})
  }

  updateMatch(match_id, gameState) {
    const update = {$set: {
      chesspieces1: gameState.chesspieces1,
      chesspieces2: gameState.chesspieces2,
      player_turn: gameState.nextPlayerTurn
    }}
    this.matches.updateOne({_id: ObjectId(match_id)}, update)
  }
}


module.exports = DatabaseInterface
