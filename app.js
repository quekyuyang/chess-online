require('dotenv').config()

var express = require('express');
var session = require('express-session');
var path = require('path');
var {new_match, find_match, move_piece} = require("./database.js")

var app = express();
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
    const match_id = new_match(pending_match_ids);
    req.session.match_id = match_id.toString();
  }

  next();
})

app.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'chess.html'));
})

function respond_match_data(match_id, res) {
  find_match(match_id)
  .then(function (match) {
    res.json(match)
  })
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
  move_piece(req.session.match_id, req.body)
  .then(function(state) {
    res.json(state)
  });
});

app.listen(3000);
