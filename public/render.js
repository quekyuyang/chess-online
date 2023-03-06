const div_array = [];

function init(pieces) {
  let divs_chessboard = Array.from(document.querySelectorAll("div.square"));
  for (let i = 0; i < 8; i++) {
    div_array.push(divs_chessboard.slice(i*8, i*8+8));
  }

  const squares = document.querySelectorAll("div.chessboard div");
  const sprites = [];
  for (const chesspiece of pieces) {
    const img_path = get_img_path(chesspiece.move_type, chesspiece.player)
    const sprite = create_piece_sprite(img_path, chesspiece.id)
    sprites[chesspiece.id] = sprite
    const x = chesspiece._pos.x
    const y = chesspiece._pos.y
    squares[y*8 + x].append(sprite)
  }

  return sprites;
}

function get_img_path(type, player_n) {
  let img_path = "images/";
  img_path += player_n == 1 ? "w_" : "b_";
  img_path = img_path + type + ".png";
  return img_path;
}

function create_piece_sprite(img_path, id) {
  let sprite = new Image();
  sprite.src = img_path;
  sprite.classList.add('chess-piece');
  sprite.id = id;
  sprite.draggable = false;
  return sprite;
}

function setNames(playerName, opponentName) {
  document.getElementById('playerName').innerHTML = playerName
  document.getElementById('opponentName').innerHTML = opponentName
}


function update(pieces, graveyard) {
  for (const chesspiece of graveyard) {
    let img_elem = document.getElementById(chesspiece.id);
    img_elem.style.position = "absolute";
    img_elem.style.left = -1000;
  }

  let squares = document.querySelectorAll("div.chessboard div");
  for (const chesspiece of pieces) {
    let img_elem = document.getElementById(chesspiece.id);
    const x = chesspiece._pos.x
    const y = chesspiece._pos.y
    squares[y*8 + x].append(img_elem);
  }
}

function show_moves(moves) {
  for (const move of moves) {
    let div_dest = div_array[move.pos.y][move.pos.x];
    div_dest.style.border = "solid green";
  }
}

function clear_moves() {
  for (let div of div_array.flat())
    div.style.border = "";
}


function setMessage(message) {
  const messageBox = document.getElementById("message")
  messageBox.innerHTML = message
}


export { init, setNames, update, show_moves, clear_moves, setMessage };
