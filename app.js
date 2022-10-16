require('dotenv').config()

var express = require('express');
var session = require('express-session');
var path = require('path');
const DatabaseInterface = require("./DatabaseInterface.js")

var app = express();
app.use(express.static('public'));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

database_interface = new DatabaseInterface();

app.use(function (req, res, next) {
  if (!req.session.match_id) {
    const match_id = database_interface.new_match();
    req.session.match_id = match_id.toString();
  }

  next();
})

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'chess.html'));
})

app.get('/valid_moves', function (req, res, next) {
  database_interface.find_match(req.session.match_id)
  .then(match => {res.json(match);});
});

app.post('/move_piece', function (req, res, next) {
  database_interface.move_piece(req.session.match_id, req.body)
  .then(function(state) {
    res.json(state)
  });
});

app.listen(3000);
