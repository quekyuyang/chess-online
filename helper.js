let waiting = null;


function queue_match(req, res, database_interface) {
  if (waiting === null) {
    waiting = {req: req, res: res};
  }
  else {
    const req_waiting = waiting;
    waiting = null;
    
    const match_id = database_interface.new_match(
      req_waiting.req.session.id, req.session.id
    ).toString();
    req.session.match_id = match_id;
    req_waiting.req.session.match_id = match_id;

    database_interface.find_match(match_id)
    .then(match => {
      // Determine whether player of current request gets first move
      const first_move_current = req.session.id == match.player_ids[0]
      // Determine whether player of waiting request gets first move
      const first_move_waiting = req_waiting.req.session.id == match.player_ids[0]

      res.json({
        ...match,
        first_move: first_move_current,
        color: 2,
        playerName: req.session.username,
        opponentName: req_waiting.req.session.username
      })
      req_waiting.res.json({
        ...match,
        first_move: first_move_waiting,
        color: 1,
        playerName: req_waiting.req.session.username,
        opponentName: req.session.username
      })
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
      req_waiting.res.sendStatus(500);
      waiting = null;
    });
  }
}


module.exports = queue_match;
