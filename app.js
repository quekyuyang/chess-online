require('dotenv').config()

var express = require('express');
var session = require('express-session');
var path = require('path');
var Chessboard = require('./chess/Chessboard.js');
var MoveManager = require('./chess/MoveManager.js');
var Vector = require('./chess/Position.js');
var { Rook, Bishop, Queen, Knight, Pawn, King } = require("./chess/ChessPiece.js");

var app = express();

// const mongoose = require('mongoose');
// const mongoDB = `mongodb+srv://user1:${process.env.MONGOOSE_PASS}@cluster0.sloa7os.mongodb.net/?retryWrites=true&w=majority`;
// mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static('public'));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

app.use(function (req, res, next) {
  if (!req.session.chesspieces1) {
    const chessboard = new Chessboard();
    req.session.chesspieces1 = chessboard.chesspieces1;
    req.session.chesspieces2 = chessboard.chesspieces2;
    req.session.graveyard = chessboard.graveyard;
    req.session.player_turn = 1;
  }
  next();
})

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'chess.html'));
})

app.get('/valid_moves', function (req, res, next) {
  const chessboard = new Chessboard(req.session.chesspieces1, req.session.chesspieces2, req.session.graveyard);
  let move_manager = new MoveManager(chessboard);
  res.json({
    chessboard: chessboard.chessboard,
    graveyard: chessboard.graveyard,
    moves: move_manager.compute_moves(req.session.player_turn)
  });
});

app.post('/move_piece', function (req, res, next) {
  const chessboard = new Chessboard(req.session.chesspieces1, req.session.chesspieces2, req.session.graveyard);
  let move_manager = new MoveManager(chessboard);
  const success = move_manager.move_piece(req.body.id, new Vector(req.body.x, req.body.y), req.session.player_turn);

  if (success) {
    req.session.chesspieces1 = chessboard.chesspieces1;
    req.session.chesspieces2 = chessboard.chesspieces2;
    req.session.player_turn = req.session.player_turn % 2 + 1;
  }

  const movesets = move_manager.compute_moves(req.session.player_turn);
  res.json({chessboard: chessboard.chessboard, graveyard: chessboard.graveyard, moves: movesets});
});

app.listen(3000);
