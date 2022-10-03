let divs_chessboard = Array.from(document.querySelectorAll("div.square"));
let div_array_to_fill = [];
for (let i = 0; i < 8; i++) {
  div_array_to_fill.push(divs_chessboard.slice(i*8, i*8+8));
}
const div_array = div_array_to_fill;

function update(chessboard, graveyard) {
  // for (let chesspiece of graveyard) {
  //   let img_elem = document.querySelector("#"+chesspiece.id);
  //   img_elem.style.position = "absolute";
  //   img_elem.style.left = -1000;
  // }

  chessboard = chessboard.flat();
  let squares = document.querySelectorAll("div.chessboard div");
  for (let i = 0; i < chessboard.length; i++) {
    // if a chess piece is on square, render it there
    if (chessboard[i]) {
      const chesspiece = chessboard[i];
      let img_elem = document.getElementById(chesspiece.id);
      squares[i].append(img_elem);
    }
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


export { update, show_moves, clear_moves };
