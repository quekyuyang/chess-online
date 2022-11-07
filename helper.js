let waiting = null;


function queue_match(req, res, database_interface) {
  if (waiting === null) {
    waiting = {req: req, res: res};
  }
  else {
    const match_id = database_interface.new_match(
      waiting.req.session.id, req.session.id
    ).toString();
    req.session.match_id = match_id;
    waiting.req.session.match_id = match_id;

    database_interface.find_match(match_id)
    .then(match => {
      // Determine whether player of current request gets first move
      const first_move_current = req.session.id == match.player_ids[0]
      // Determine whether player of waiting request gets first move
      const first_move_waiting = waiting.req.session.id == match.player_ids[0]

      res.json({
        ...match,
        first_move: first_move_current
      })
      waiting.res.json({
        ...match,
        first_move: first_move_waiting
      })
      waiting = null;
    })
    .catch(error => {
      console.log(error);
      res.sendStatus(500);
      waiting.res.sendStatus(500);
      waiting = null;
    });
  }
}


module.exports = queue_match;
