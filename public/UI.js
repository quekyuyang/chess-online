import {init, update, show_moves, clear_moves} from "./render.js"


let current_player_moves = {};

function createPickupEvent(elem, moves, chessboard_elem, move_piece) {
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
        move_piece(this.id, element.dataset.col, element.dataset.row);
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

export { createPickupEvent };
