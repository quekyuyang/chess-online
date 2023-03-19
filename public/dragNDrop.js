import {init, update, show_moves, clear_moves} from "./render.js"


let current_player_moves = {};

function createPickupEvent(elem, moves, containingElem, move_piece) {
  function move(event) {
    const containingRect = containingElem.getBoundingClientRect();
    elem.style.left = `${event.pageX - containingRect.left}px`;
    elem.style.top = `${event.pageY - containingRect.top}px`;
  }

  function drop(event) {
    containingElem.removeEventListener("mousemove", move);
    this.removeEventListener("mouseup", drop);
    clear_moves();
    this.style.position = "relative";
    this.style.left = "50%";
    this.style.top = "50%";
    this.style.zIndex = 0;
    let elements_at_pos = document.elementsFromPoint(event.pageX, event.pageY);
    for (let element of elements_at_pos) {
      const moveValid = current_player_moves[this.id].some(move => move.pos.x == element.dataset.col && move.pos.y == element.dataset.row)
      if (moveValid && element.classList.contains("square")) {
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
      const containingRect = containingElem.getBoundingClientRect();
      this.style.left = `${event.pageX - containingRect.left}px`;
      this.style.top = `${event.pageY - containingRect.top}px`;
      this.style.zIndex = 100; // image must be on top for drop event to work

      show_moves(current_player_moves[this.id]);

      containingElem.addEventListener("mousemove", move);
      this.addEventListener("mouseup", drop);
    }
  };
}

export { createPickupEvent };
