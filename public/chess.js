import {createPickupEvent, wait_for_update} from "./UI.js"
import {init, update} from "./render.js"
import {SpriteManager} from "./SpriteManager.js"

function create_piece_sprite(img_path, id) {
  let sprite = new Image();
  sprite.src = img_path;
  sprite.classList.add('chess-piece');
  sprite.id = id;
  sprite.draggable = false;
  return sprite;
}


function get_img_path(type, player_n) {
  let img_path = "images/";
  img_path += player_n == 1 ? "w_" : "b_";
  img_path = img_path + type + ".png";
  return img_path;
}


function main() {
  fetch('http://127.0.0.1:3000/new_match')
  .then(() => fetch('http://127.0.0.1:3000/game/valid_moves'))
  .then((response) => response.json())
  .then(function (data) {
    init();
    const chessboard = data.chessboard.flat();
    let squares = document.querySelectorAll("div.chessboard div");
    const sprites = [];
    for (let i = 0; i < chessboard.length; i++) {
      if (chessboard[i]) {
        let chesspiece = chessboard[i];
        let img_path = get_img_path(chesspiece.move_type, chesspiece.player);
        let sprite = create_piece_sprite(img_path, chesspiece.id);
        sprites[chesspiece.id] = sprite;
        squares[i].append(sprite);
      }
    }
    update(data.chessboard, data.graveyard);
    const sprite_manager = new SpriteManager(sprites);
    if (data.first_move)
      sprite_manager.enable_move(data.moves);
    else
      wait_for_update(sprite_manager.enable_move);
  });
}

main();
