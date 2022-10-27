let waiting = null;


function queue_match(req, res, database_interface) {
  if (waiting === null) {
    waiting = {req: req, res: res};
  }
  else {
    const match_id = database_interface.new_match(
      waiting.req.session.id, req.session.id
    );
    req.session.match_id = match_id.toString();
    waiting.req.session.match_id = match_id.toString();
    res.json({opponent: waiting.req.session.id});
    waiting.res.json({opponent: req.session.id});
    waiting = null;
  }
}


module.exports = queue_match;
