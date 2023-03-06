const {newGame} = require('./chess/Game')


let waiting = null;

function queueMatch(req, res, database_interface) {
  if (waiting === null) {
    waiting = {req: req, res: res}
  }
  else {
    const req_waiting = waiting
    waiting = null

    return newMatch(req_waiting.req, req, database_interface)
    .then(responses => {
      req_waiting.res.json(responses.res1)
      res.json(responses.res2)
    })
  }
}


function newMatch(req1, req2, database_interface) {
  const game = newGame()
  return database_interface.newMatch(game, req1.session.id, req2.session.id)
  .then(match_id => {
    req1.session.match_id = match_id
    req2.session.match_id = match_id
    const matchInfo = {
      chesspieces1: game.chesspieces1,
      chesspieces2: game.chesspieces2,
      graveyard: game.graveyard,
      moves: game.moves,
      player_ids: [req1.session.id, req2.session.id]
    }

    // Determine whether player of current request gets first move
    const first_move_current = req2.session.id == matchInfo.player_ids[0]
    // Determine whether player of waiting request gets first move
    const first_move_waiting = req1.session.id == matchInfo.player_ids[0]

    const res1 = {
      ...matchInfo,
      first_move: first_move_waiting,
      color: 1,
      playerName: req1.session.username ? req1.session.username : 'anonymous',
      opponentName: req2.session.username ? req2.session.username : 'anonymous'
    }

    const res2 = {
      ...matchInfo,
        first_move: first_move_current,
        color: 2,
        playerName: req2.session.username ? req2.session.username : 'anonymous',
        opponentName: req1.session.username ? req1.session.username : 'anonymous'
    }

    return {
      res1: res1,
      res2: res2
    }
  })
}


module.exports = queueMatch;
