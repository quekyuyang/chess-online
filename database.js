var Chessboard = require('./chess/Chessboard.js')
var MoveManager = require('./chess/MoveManager.js');
var Vector = require('./chess/Position.js');
const { MongoClient, ObjectId } = require("mongodb")


const uri = `mongodb+srv://user1:${process.env.MONGOOSE_PASS}@cluster0.sloa7os.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
client.connect(function (client) {});
const database = client.db('chess-online');
const matches = database.collection('matches');


function new_match(pending_match_ids) {
  const chessboard = new Chessboard()
  chessboard.init()
  const match_id = ObjectId()
  pending_match_ids.add(match_id.toString())

  matches.insertOne({
    _id: match_id,
    chesspieces1: chessboard.chesspieces1,
    chesspieces2: chessboard.chesspieces2,
    graveyard: chessboard.graveyard,
    player_turn: 1
  }, function (err, result) {
    pending_match_ids.delete(match_id.toString())
  })

  return match_id
}


function find_match(id) {
  return matches.findOne({_id: ObjectId(id)})
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


function move_piece(match_id, move) {
  return matches.findOne({_id: ObjectId(match_id)})
  .then(function(result) {
    const chessboard = new Chessboard(result.chesspieces1, result.chesspieces2, result.graveyard);
    let move_manager = new MoveManager(chessboard);
    const success = move_manager.move_piece(move.id, new Vector(move.x, move.y), result.player_turn);

    const next_player_turn = result.player_turn % 2 + 1;
    if (success) {
      const update = {$set: {
        chesspieces1: chessboard.chesspieces1,
        chesspieces2: chessboard.chesspieces2,
        player_turn: next_player_turn
      }};
      matches.updateOne({_id: ObjectId(match_id)}, update);
    }

    const movesets = move_manager.compute_moves(next_player_turn);
    return {
      chessboard: chessboard.chessboard,
      graveyard: chessboard.graveyard,
      moves: movesets
    }
  });
}


module.exports = {new_match, find_match, move_piece}
