const express = require('express');
const game_router = express.Router();
const {execMoveInGame} = require('./chess/Game')


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
      const gameStateNew = execMoveInGame(match, req.body.id, req.body.x, req.body.y)

      if (gameStateNew === null) {
        res.json({success: false})
      }
      else {
        res.json({
          success: true,
          chessboard: gameStateNew.chessboard.chessboard,
          chesspieces1: gameStateNew.chesspieces1,
          chesspieces2: gameStateNew.chesspieces2,
          graveyard: gameStateNew.chessboard.graveyard,
          check: gameStateNew.check,
          checkmate: gameStateNew.checkmate,
          stalemate: gameStateNew.stalemate
        })
        database_interface.updateMatch(req.session.match_id, gameStateNew.chessboard, gameStateNew.nextPlayerTurn)

        gameStateNew.chessboard = gameStateNew.chessboard.chessboard // TODO: Somehow make it such that this is not needed
        update_opponent(req.session.match_id, gameStateNew)
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
