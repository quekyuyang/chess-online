import {createPickupEvent} from "./UI.js"


class SpriteManager {
  constructor(sprites) {
    self = this
    this.sprites = sprites
    this.events = {}
  }

  enable_move(movesets) {
    for (const piece_id in movesets) {
      let pickup = createPickupEvent(self.sprites[piece_id], movesets, document.querySelector(".chessboard"), self.enable_move, self.disable_move)
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
