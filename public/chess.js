import {createPickupEvent} from "./UI.js"
import {init, update} from "./render.js"

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
  fetch('http://127.0.0.1:3000/valid_moves')
  .then((response) => response.json())
  .then(function (data) {
    init();
    const chessboard = data.chessboard.flat();
    let squares = document.querySelectorAll("div.chessboard div");
    for (let i = 0; i < chessboard.length; i++) {
      if (chessboard[i]) {
        let chesspiece = chessboard[i];
        let img_path = get_img_path(chesspiece.move_type, chesspiece.player);
        let sprite = create_piece_sprite(img_path, chesspiece.id);
        squares[i].append(sprite);

        let pickup = createPickupEvent(sprite, data.moves, document.querySelector(".chessboard"));
        sprite.addEventListener("mousedown", pickup);
      }
    }
    update(data.chessboard, data.graveyard);
  });
}

main();
