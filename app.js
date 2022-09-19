require('dotenv').config()

var express = require('express');
var session = require('express-session');
var path = require('path');
const { MongoClient, ObjectId } = require("mongodb");
var Chessboard = require('./chess/Chessboard.js');
var MoveManager = require('./chess/MoveManager.js');
var Vector = require('./chess/Position.js');
var { Rook, Bishop, Queen, Knight, Pawn, King } = require("./chess/ChessPiece.js");

var app = express();

const uri = `mongodb+srv://user1:${process.env.MONGOOSE_PASS}@cluster0.sloa7os.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
client.connect(function (client) {

});

app.use(express.static('public'));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

pending_match_ids = new Set();

app.use(function (req, res, next) {
  if (!req.session.match_id) {
    const database = client.db('chess-online');
    const matches = database.collection('matches');
    const chessboard = new Chessboard();
    chessboard.init();
    const match_id = ObjectId();
    pending_match_ids.add(match_id.toString());

    matches.insertOne({
      _id: match_id,
      chesspieces1: chessboard.chesspieces1,
      chesspieces2: chessboard.chesspieces2,
      graveyard: chessboard.graveyard,
      player_turn: 1
    }, function (err, result) {
      pending_match_ids.delete(match_id.toString());
    });
    req.session.match_id = match_id.toString();
  }

  next();
})

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'chess.html'));
})

function respond_match_data(match_id, res) {
  const database = client.db('chess-online');
  const matches = database.collection('matches');

  matches.findOne(
    {_id: ObjectId(match_id)},
    function(err, result) {
      const chessboard = new Chessboard(result.chesspieces1, result.chesspieces2, result.graveyard);
      let move_manager = new MoveManager(chessboard);
      res.json({
        chessboard: chessboard.chessboard,
        graveyard: chessboard.graveyard,
        moves: move_manager.compute_moves(result.player_turn)
      });
    });
}

app.get('/valid_moves', function (req, res, next) {
  if (pending_match_ids.has(req.session.match_id)) {
    const interval_id = setInterval(function() {
      if (!pending_match_ids.has(req.session.match_id)) {
        respond_match_data(req.session.match_id, res);
        clearInterval(interval_id);
      }
    }, 1000);
  }
  else {
    respond_match_data(req.session.match_id, res);
  }
});

app.post('/move_piece', function (req, res, next) {
  const database = client.db('chess-online');
  const matches = database.collection('matches');
  matches.findOne({_id: ObjectId(req.session.match_id)}, function(err, result) {
    const chessboard = new Chessboard(result.chesspieces1, result.chesspieces2, result.graveyard);
    let move_manager = new MoveManager(chessboard);
    const success = move_manager.move_piece(req.body.id, new Vector(req.body.x, req.body.y), result.player_turn);

    const next_player_turn = result.player_turn % 2 + 1;
    if (success) {
      const update = {$set: {
        chesspieces1: chessboard.chesspieces1,
        chesspieces2: chessboard.chesspieces2,
        player_turn: next_player_turn
      }};
      matches.updateOne({_id: ObjectId(req.session.match_id)}, update);
    }

    const movesets = move_manager.compute_moves(next_player_turn);
    res.json({chessboard: chessboard.chessboard, graveyard: chessboard.graveyard, moves: movesets});
  });
});

app.listen(3000);
