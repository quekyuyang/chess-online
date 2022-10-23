var Chessboard = require('./chess/Chessboard.js')
var MoveManager = require('./chess/MoveManager.js');
var Vector = require('./chess/Position.js');
const { ObjectId } = require("mongodb")
const get_matches_mongodb = require("./mongodb.js")


class DatabaseInterface {
  constructor() {
    this.matches = get_matches_mongodb(
      `mongodb+srv://user1:${process.env.MONGOOSE_PASS}\
@cluster0.sloa7os.mongodb.net/?retryWrites=true&w=majority`)
    this.pending_match_ids = new Set()
  }

  new_match() {
    const chessboard = new Chessboard()
    chessboard.init()
    const match_id = ObjectId()
    this.pending_match_ids.add(match_id.toString())

    this.matches.insertOne({
      _id: match_id,
      chesspieces1: chessboard.chesspieces1,
      chesspieces2: chessboard.chesspieces2,
      graveyard: chessboard.graveyard,
      player_turn: 1
    }, (err, result) => {
      this.pending_match_ids.delete(match_id.toString())
    })

    return match_id
  }

  find_match(id) {
    return new Promise((resolve, reject) => {
      if (this.pending_match_ids.has(id)) {
        this.wait_pending_match(id, resolve, reject)
      }
      else {
        this._find_match_database(id)
        .then(match => {resolve(match)})
      }
    })
  }

  wait_pending_match(id, resolve, reject) {
    let attempts = 0
    const interval_id = setInterval(() => {
      if (!this.pending_match_ids.has(id)) {
        clearInterval(interval_id)
        this._find_match_database(id)
        .then(match => {resolve(match)})
      }
      else {
        attempts++
        if (attempts > 2) {
          clearInterval(interval_id)
          reject('Pending match insertion timeout')
        }
      }
    }, 500)
  }

  _find_match_database(id) {
    return this.matches.findOne({_id: ObjectId(id)})
    .then(function(result) {
      const chessboard = new Chessboard(result.chesspieces1, result.chesspieces2, result.graveyard)
      let move_manager = new MoveManager(chessboard)
      return {
        chessboard: chessboard.chessboard,
        graveyard: chessboard.graveyard,
        moves: move_manager.compute_moves(result.player_turn)
      }
    })
  }

  move_piece(match_id, move) {
    return this.matches.findOne({_id: ObjectId(match_id)})
    .then(result => {
      const chessboard = new Chessboard(result.chesspieces1, result.chesspieces2, result.graveyard);
      let move_manager = new MoveManager(chessboard);
      const success = move_manager.move_piece(move.id, new Vector(move.x, move.y), result.player_turn);

      if (success) {
        const next_player_turn = result.player_turn % 2 + 1;
        const update = {$set: {
          chesspieces1: chessboard.chesspieces1,
          chesspieces2: chessboard.chesspieces2,
          player_turn: next_player_turn
        }};
        this.matches.updateOne({_id: ObjectId(match_id)}, update);

        const movesets = move_manager.compute_moves(next_player_turn);
        return {
          success: true,
          chessboard: chessboard.chessboard,
          graveyard: chessboard.graveyard,
          moves: movesets
        }
      }
      else {
        return {success: false}
      }
    });
  }
}


module.exports = DatabaseInterface
