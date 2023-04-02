const {newGame} = require('../chess/Game')


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
      player_ids: [req1.session.id, req2.session.id]
    }

    const res1 = {
      ...matchInfo,
      moves: game.moves,
      color: 1,
      playerName: req1.session.username ? req1.session.username : 'anonymous',
      opponentName: req2.session.username ? req2.session.username : 'anonymous'
    }

    const res2 = {
      ...matchInfo,
        moves: {},
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
