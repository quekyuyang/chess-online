import {createPickupEvent} from "./UI.js"
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

let sprite_manager = null;
let moves = null;

function move_piece(id, x, y) {
  send_move_to_server(id, x, y)
  .then((response) => response.json())
  .then(function (data) {
    if (data.success) {
      for (let id in moves) {
        delete moves[id];
      }
      Object.assign(moves, data.moves);
      update(data.chessboard, data.graveyard);
      sprite_manager.disable_move();
      wait_for_update();
    }
  });
}

function wait_for_update() {
  return fetch('http://127.0.0.1:3000/game/match_state')
  .then((response) => response.json())
  .then((state) => {
    moves = state.moves;
    update(state.chessboard, state.graveyard);
    sprite_manager.enable_move(state.moves);
  });
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
    sprite_manager = new SpriteManager(sprites, move_piece);
    if (data.first_move)
    {
      moves = data.moves;
      sprite_manager.enable_move(data.moves);
    }
    else
      wait_for_update();
  });
}

main();
