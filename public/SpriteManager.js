import {createPickupEvent} from "./dragNDrop.js"


class SpriteManager {
  constructor(sprites, move_piece_callback) {
    self = this
    this.sprites = sprites
    this.events = {}
    this.move_piece_callback = move_piece_callback
  }

  enable_move(movesets) {
    for (const piece_id in movesets) {
      let pickup = createPickupEvent(self.sprites[piece_id], movesets, document.querySelector(".main"), self.move_piece_callback)
      self.sprites[piece_id].addEventListener("mousedown", pickup)
      self.events[piece_id] = pickup
    }
  }

  disable_move() {
    for (const piece_id in self.sprites) {
      self.sprites[piece_id].removeEventListener("mousedown", self.events[piece_id])
      delete self.events[piece_id]
    }
  }
}


export {SpriteManager}
