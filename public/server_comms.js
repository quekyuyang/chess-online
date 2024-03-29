function newMatch() {
  return fetch('http://127.0.0.1:3000/new_match')
  .then((response) => response.json())
}

function send_move_to_server(id, x, y) {
  return fetch('http://127.0.0.1:3000/game/move_piece', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      id: id,
      x: x,
      y: y
    })
  })
  .then((response) => response.json())
}

function getGameState() {
  return fetch('http://127.0.0.1:3000/game/match_state')
  .then((response) => response.json())
}

export {newMatch, send_move_to_server, getGameState}
