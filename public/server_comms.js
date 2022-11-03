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

function get_match_state() {
  return fetch('http://127.0.0.1:3000/game/match_state')
  .then((response) => response.json())
}

export {send_move_to_server, get_match_state}
