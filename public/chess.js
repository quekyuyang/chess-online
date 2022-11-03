import {Game} from "./Game.js"


function get_match_data() {
  return fetch('http://127.0.0.1:3000/new_match')
  .then(() => fetch('http://127.0.0.1:3000/game/valid_moves'))
  .then((response) => response.json())
}

const game = new Game();
game.init(get_match_data);
