const express = require('express');
const game_router = express.Router();


game_router.all('*', (req, res, next) => {
  if (req.session.match_id) {
    next();
  }
});

game_router.get('/valid_moves', function (req, res, next) {
  const database_interface = req.app.get('database_interface');
  database_interface.find_match(req.session.match_id)
  .then(match => {res.json(match);})
  .catch(error => {
    console.log(error);
    res.sendStatus(500);
  });
});

game_router.post('/move_piece', function (req, res, next) {
  const database_interface = req.app.get('database_interface');
  database_interface.move_piece(req.session.match_id, req.session.id, req.body)
  .then(function(state) {
    res.json(state);
    if (state.success)
      update_opponent(req.session.match_id, state);
  });
});

let pending_res = {};
game_router.get('/match_state', (req, res, next) => {
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

module.exports = {game_router, update_opponent}
