import {Game} from "../public/Game.js"
import {init, update} from "../public/render.js"
import {SpriteManager} from "../public/SpriteManager.js"
import {get_match_data, send_move_to_server, get_match_state} from "../public/server_comms.js"


jest.mock("../public/render.js")
jest.mock("../public/SpriteManager.js")
jest.mock("../public/server_comms.js")


beforeEach(() => {
  SpriteManager.mockClear()
})

function emptyChessboard() {
  const chessboard = new Array(8)
  for (let i = 0; i < 8; i++) {
    chessboard[i] = new Array(8).fill(null)
  }
  return chessboard
}

function mockMoves() {
  return {
    'id1': [{pos: {y:0, x:0}, capture: null}]
  }
}

function flippedMockMoves() {
  return {
    'id1': [{pos: {y:7, x:7}, capture: null}]
  }
}


test("Start game with first move", async () => {
  const match_state = {
    chessboard: emptyChessboard(),
    graveyard: null,
    first_move: true,
    color: 1,
    moves: mockMoves()
  }
  get_match_data.mockResolvedValue(match_state)
  const game = new Game()
  await game.init()

  expect(SpriteManager.mock.instances[0].enable_move.mock.calls.length).toBe(1)
  expect(SpriteManager.mock.instances[0].enable_move.mock.calls[0][0])
  .toBe(match_state.moves)
})


test("Start game without first move", async () => {
  const new_match_state = {
    chessboard: emptyChessboard(),
    graveyard: [],
    moves: mockMoves()
  }
  get_match_state.mockResolvedValue(new_match_state)

  const init_match_state = {
    chessboard: emptyChessboard(),
    graveyard: null,
    first_move: false,
    color: 2
  }
  get_match_data.mockResolvedValue(init_match_state)
  const game = new Game()
  await game.init()

  expect(SpriteManager.mock.instances[0].enable_move.mock.calls.length).toBe(1)
  expect(SpriteManager.mock.instances[0].enable_move.mock.calls[0][0])
  .toEqual(flippedMockMoves())
})


test("Move piece then wait for opponent", async () => {
  const match_state1 = {
    chessboard: emptyChessboard(),
    graveyard: null,
    first_move: true,
    color: 1,
    moves: mockMoves()
  }
  get_match_data.mockResolvedValue(match_state1)
  const game = new Game()
  await game.init()

  const match_state2 = {
    chessboard: emptyChessboard(),
    graveyard: [],
    success: true
  }
  send_move_to_server.mockResolvedValue(match_state2)
  const match_state3 = {
    chessboard: emptyChessboard(),
    graveyard: [],
    moves: mockMoves()
  }
  get_match_state.mockResolvedValue(match_state3)

  await game.move_piece('id', 1, 1)
  expect(SpriteManager.mock.instances[0].enable_move.mock.calls.length).toBe(2)
  expect(SpriteManager.mock.instances[0].enable_move.mock.calls[1][0])
  .toBe(match_state3.moves)
})
