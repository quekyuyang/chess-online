const express = require('express')
var path = require('path');
const index = express.Router();
const DatabaseInterface = require("./DatabaseInterface.js");


const database_interface = new DatabaseInterface();
let waiting = null;

index.get('/', function (req, res, next) {
  if (!req.session.match_id) {
    let match_id;
    if (waiting === null) {
      match_id = database_interface.new_match();
      waiting = match_id;
    }
    else {
      match_id = waiting;
      waiting = null;
    }
    req.session.match_id = match_id.toString();
  }
  res.sendFile(path.join(__dirname, 'chess.html'));
})

index.get('/valid_moves', function (req, res, next) {
  database_interface.find_match(req.session.match_id)
  .then(match => {res.json(match);})
  .catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
});

index.post('/move_piece', function (req, res, next) {
  database_interface.move_piece(req.session.match_id, req.body)
  .then(function(state) {
    res.json(state);
    if (state.success)
      update_opponent(req.session.match_id, state);
  });
});

let pending_res = {};
index.get('/match_state', (req, res, next) => {
  if (!pending_res[req.session.match_id])
    pending_res[req.session.match_id] = [res];
  else
    pending_res[req.session.match_id].push(res);
})

function update_opponent(match_id, state) {
  if (pending_res[match_id]) {
    for (const res of pending_res[match_id])
      res.json(state);

    delete pending_res[match_id]
    return true;
  }
  else {
    return false;
  }
}


module.exports = { index, update_opponent };
