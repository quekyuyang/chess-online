import {init, update, show_moves, clear_moves} from "./render.js"


let current_player_moves = {};

function createPickupEvent(elem, moves, chessboard_elem, enable_move, disable_move) {
  function move(event) {
    elem.style.left = `${event.pageX}px`;
    elem.style.top = `${event.pageY}px`;
  }

  function drop(event) {
    document.querySelector(".chessboard").removeEventListener("mousemove", move);
    this.removeEventListener("mouseup", drop);
    clear_moves();
    this.style.position = "relative";
    this.style.left = "50%";
    this.style.top = "50%";
    this.style.zIndex = 0;
    let elements_at_pos = document.elementsFromPoint(event.pageX, event.pageY);
    for (let element of elements_at_pos) {
      if (element.classList.contains("square")) {
        send_move_to_server(this.id, element.dataset.col, element.dataset.row)
        .then((response) => response.json())
        .then(function (data) {
          if (data.success) {
            for (let id in current_player_moves) {
              delete current_player_moves[id];
            }
            Object.assign(current_player_moves, data.moves);
            update(data.chessboard, data.graveyard);
            disable_move();
            wait_for_update(enable_move);
          }
        });
        break;
      }
    }
  }

  current_player_moves = moves;

  return function pickup(event) {
    if (current_player_moves[this.id]) {
      let bound_rect = this.getBoundingClientRect();
      this.style.width = `${bound_rect.width}px`;
      this.style.height = `${bound_rect.height}px`;
      this.style.position = "absolute";
      this.style.left = `${event.pageX}px`;
      this.style.top = `${event.pageY}px`;
      this.style.zIndex = 100; // image must be on top for drop event to work

      show_moves(current_player_moves[this.id]);

      chessboard_elem.addEventListener("mousemove", move);
      this.addEventListener("mouseup", drop);
    }
  };
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
  });
}


function wait_for_update(enable_move) {
  return fetch('http://127.0.0.1:3000/game/match_state')
  .then((response) => response.json())
  .then((state) => {
    update(state.chessboard, state.graveyard);
    enable_move(state.moves);
  });
}


export { createPickupEvent, wait_for_update };
