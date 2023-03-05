import {Game} from "../public/Game.js"
import {setMessage} from "../public/render.js"
import {SpriteManager} from "../public/SpriteManager.js"
import {get_match_data, send_move_to_server, get_match_state} from "../public/server_comms.js"
import {flipBoard, flipMoves} from "../public/chessboardFlip.js"


jest.mock("../public/render.js")
jest.mock("../public/SpriteManager.js")
jest.mock("../public/server_comms.js")
jest.mock("../public/chessboardFlip.js")

flipBoard.mockReturnValue([])
flipMoves.mockReturnValue("flippedMoves")

beforeEach(() => {
  SpriteManager.mockClear()
  setMessage.mockClear()
})


test("Start game with first move", async () => {
  const match_state = {
    chessboard: [],
    graveyard: null,
    first_move: true,
    color: 1,
    moves: "moves"
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
    chessboard: [],
    graveyard: [],
    moves: "moves"
  }
  get_match_state.mockResolvedValue(new_match_state)

  const init_match_state = {
    chessboard: [],
    graveyard: null,
    first_move: false,
    color: 2
  }
  get_match_data.mockResolvedValue(init_match_state)
  const game = new Game()
  await game.init()

  expect(SpriteManager.mock.instances[0].enable_move.mock.calls.length).toBe(1)
  expect(SpriteManager.mock.instances[0].enable_move.mock.calls[0][0])
  .toEqual("flippedMoves")
})


test("Move piece then wait for opponent", async () => {
  const match_state1 = {
    chessboard: [],
    graveyard: null,
    first_move: true,
    color: 1,
    moves: "moves1"
  }
  get_match_data.mockResolvedValue(match_state1)
  const game = new Game()
  await game.init()

  const match_state2 = {
    chessboard: [],
    graveyard: [],
    success: true
  }
  send_move_to_server.mockResolvedValue(match_state2)
  const match_state3 = {
    chessboard: [],
    graveyard: [],
    moves: "moves2"
  }
  get_match_state.mockResolvedValue(match_state3)

  await game.move_piece('id', 1, 1)
  expect(SpriteManager.mock.instances[0].enable_move.mock.calls.length).toBe(2)
  expect(SpriteManager.mock.instances[0].enable_move.mock.calls[1][0])
  .toBe(match_state3.moves)
})


const initMatchState = {
  chessboard: [],
  graveyard: null,
  moves: "moves1"
}

const initMatchStateFirstMove = {
  ...initMatchState,
  first_move: true,
  color: 1
}

const initMatchStateSecondMove = {
  ...initMatchState,
  first_move: false,
  color: 2
}

const moveMatchState = {
  chessboard: [],
  graveyard: [],
  success: true,
}


test("Display 'You win' if opponent checkmate after making move", async () => {
  get_match_data.mockResolvedValue(initMatchStateFirstMove)
  const game = new Game()
  await game.init()

  const moveMatchStateCheckmate = {
    ...moveMatchState,
    checkmate: true
  }
  send_move_to_server.mockResolvedValue(moveMatchStateCheckmate)
  await game.move_piece('id', 1, 1)

  expect(setMessage.mock.calls.length).toBe(1)
  expect(setMessage.mock.calls[0][0]).toBe('You win')
})


test("Display 'Stalemate' if stalemate after making move", async () => {
  get_match_data.mockResolvedValue(initMatchStateFirstMove)
  const game = new Game()
  await game.init()

  const moveMatchStateStalemate = {
    ...moveMatchState,
    stalemate: true
  }
  send_move_to_server.mockResolvedValue(moveMatchStateStalemate)
  await game.move_piece('id', 1, 1)

  expect(setMessage.mock.calls.length).toBe(1)
  expect(setMessage.mock.calls[0][0]).toBe('Stalemate')
})


test("Clear display message if neither checkmate nor stalemate after making move", async () => {
  get_match_data.mockResolvedValue(initMatchStateFirstMove)
  const game = new Game()
  await game.init()

  send_move_to_server.mockResolvedValue(moveMatchState)
  await game.move_piece('id', 1, 1)

  expect(setMessage.mock.calls.length).toBe(2)
  expect(setMessage.mock.calls[0][0]).toBe('')
})


const newMatchState = {
  chessboard: [],
  graveyard: [],
  moves: "moves"
}


test("Display 'Check' if checked after opponent move", async () => {
  get_match_data.mockResolvedValue(initMatchStateSecondMove)

  const newMatchStateCheck = {
    ...newMatchState,
    check: true
  }
  get_match_state.mockResolvedValue(newMatchStateCheck)

  const game = new Game()
  await game.init()

  expect(setMessage.mock.calls.length).toBe(1)
  expect(setMessage.mock.calls[0][0]).toBe('Check')
})


test("Display 'Checkmate' if checkmate after opponent move", async () => {
  get_match_data.mockResolvedValue(initMatchStateSecondMove)

  const newMatchStateCheckmate = {
    ...newMatchState,
    checkmate: true
  }
  get_match_state.mockResolvedValue(newMatchStateCheckmate)

  const game = new Game()
  await game.init()

  expect(setMessage.mock.calls.length).toBe(1)
  expect(setMessage.mock.calls[0][0]).toBe('Checkmate')
})


test("Display 'Stalemate' if stalemate after opponent move", async () => {
  get_match_data.mockResolvedValue(initMatchStateSecondMove)

  const newMatchStateStalemate = {
    newMatchState,
    stalemate: true
  }
  get_match_state.mockResolvedValue(newMatchStateStalemate)

  const game = new Game()
  await game.init()

  expect(setMessage.mock.calls.length).toBe(1)
  expect(setMessage.mock.calls[0][0]).toBe('Stalemate')
})


test("Clear display message if not check or checkmate or stalemate after opponent move", async () => {
  get_match_data.mockResolvedValue(initMatchStateSecondMove)

  get_match_state.mockResolvedValue(newMatchState)

  const game = new Game()
  await game.init()

  expect(setMessage.mock.calls.length).toBe(1)
  expect(setMessage.mock.calls[0][0]).toBe('')
})
