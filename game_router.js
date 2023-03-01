const express = require('express');
const game_router = express.Router();
const MoveManager = require('./chess/MoveManager');
const Chessboard = require('./chess/Chessboard')
const Vector = require('./chess/Position')


game_router.all('*', (req, res, next) => {
  if (req.session.match_id) {
    next();
  }
});

game_router.post('/move_piece', function (req, res, next) {
  const database_interface = req.app.get('database_interface')
  database_interface.findMatch(req.session.match_id)
  .then(match => {
    if (req.session.id == match.player_ids[match.player_turn-1]) {
      const chessboard = new Chessboard(match.chesspieces1, match.chesspieces2, match.graveyard)
      const move_manager = new MoveManager(chessboard)
      const success = move_manager.move_piece(req.body.id, new Vector(req.body.x, req.body.y), match.player_turn)

      res.json({
        success: success,
        chessboard: chessboard.chessboard,
        graveyard: chessboard.graveyard
      })
      if (success) {
        const next_player_turn = match.player_turn % 2 + 1
        database_interface.updateMatch(req.session.match_id, chessboard, next_player_turn)

        const movesets = move_manager.compute_moves(next_player_turn)
        const state = {
          success: true,
          chessboard: chessboard.chessboard,
          graveyard: chessboard.graveyard,
          moves: movesets
        }
        update_opponent(req.session.match_id, state)
      }
    }
  })
})

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
