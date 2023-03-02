const MoveManager = require('./chess/MoveManager');
const Chessboard = require('./chess/Chessboard')


let waiting = null;

function queueMatch(req, res, database_interface) {
  if (waiting === null) {
    waiting = {req: req, res: res}
  }
  else {
    const req_waiting = waiting
    waiting = null

    return newMatch(req_waiting.req, req, database_interface)
    .then(matchInfo => {
      // Determine whether player of current request gets first move
      const first_move_current = req.session.id == matchInfo.player_ids[0]
      // Determine whether player of waiting request gets first move
      const first_move_waiting = req_waiting.req.session.id == matchInfo.player_ids[0]

      res.json({
        ...matchInfo,
        first_move: first_move_current,
        color: 2,
        playerName: req.session.username ? req.session.username : 'anonymous',
        opponentName: req_waiting.req.session.username ? req_waiting.req.session.username : 'anonymous'
      })
      req_waiting.res.json({
        ...matchInfo,
        first_move: first_move_waiting,
        color: 1,
        playerName: req_waiting.req.session.username ? req_waiting.req.session.username : 'anonymous',
        opponentName: req.session.username ? req.session.username : 'anonymous'
      })
    })
  }
}


function newMatch(req1, req2, database_interface) {
  const chessboard = new Chessboard()
  chessboard.init()
  return database_interface.newMatch(chessboard, req1.session.id, req2.session.id)
  .then(match_id => {
    req1.session.match_id = match_id
    req2.session.match_id = match_id
    const moveManager = new MoveManager(chessboard)
    const matchInfo = {
      chessboard: chessboard.chessboard,
      graveyard: chessboard.graveyard,
      moves: moveManager.compute_moves(1),
      player_ids: [req1.session.id, req2.session.id]
    }
    return matchInfo
  })
}


module.exports = queueMatch;
