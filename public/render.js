class Renderer {
  constructor() {
    this.chesspieces_moves = [];
    this.div_array = create_chessboard_div_array();
  }

  update(chessboard, graveyard, moves) {
    // for (let chesspiece of graveyard) {
    //   let img_elem = document.querySelector("#"+chesspiece.id);
    //   img_elem.style.position = "absolute";
    //   img_elem.style.left = -1000;
    // }

    chessboard = chessboard.flat();
    let squares = document.querySelectorAll("div.chessboard div");
    this.chesspieces_moves = {};
    for (let i = 0; i < chessboard.length; i++) {
      // if a chess piece is on square, render it there and store it's moves
      if (chessboard[i]) {
        const chesspiece = chessboard[i];
        let img_elem = document.getElementById(chesspiece.id);
        squares[i].append(img_elem);
        this.chesspieces_moves[chesspiece.id] = moves[chesspiece.id];
      }
    }
  }

  show_moves(id) {
    for (const move of this.chesspieces_moves[id]) {
      let div_dest = this.div_array[move.pos.y][move.pos.x];
      div_dest.style.border = "solid green";
    }
  }

  clear_moves() {
    for (let div of this.div_array.flat())
      div.style.border = "";
  }
}


function create_chessboard_div_array() {
  let divs_chessboard = Array.from(document.querySelectorAll("div.square"));
  let div_array = [];
  for (let i = 0; i < 8; i++) {
    div_array.push(divs_chessboard.slice(i*8, i*8+8));
  }
  return div_array;
}


export { Renderer };
