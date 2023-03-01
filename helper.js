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
    
    const chessboard = new Chessboard()
    chessboard.init()
    database_interface.newMatch(chessboard, req_waiting.req.session.id, req.session.id)
    .then(match_id => {
      req.session.match_id = match_id
      req_waiting.req.session.match_id = match_id
      const moveManager = new MoveManager(chessboard)
      const matchInfo = {
        chessboard: chessboard.chessboard,
        graveyard: chessboard.graveyard,
        moves: moveManager.compute_moves(1),
        player_ids: [req_waiting.req.session.id, req.session.id]
      }

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


module.exports = queueMatch;
