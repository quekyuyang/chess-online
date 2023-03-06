import {Game} from "../public/Game.js"
import {setMessage} from "../public/render.js"
import {SpriteManager} from "../public/SpriteManager.js"
import {newMatch, send_move_to_server, getGameState} from "../public/server_comms.js"
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

const gameState = {
  chessboard: [],
  chesspieces1: [],
  chesspieces2: [],
  graveyard: [],
  moves: "moves1"
}

const gameState2 = {
  chessboard: [],
  chesspieces1: [],
  chesspieces2: [],
  graveyard: [],
  moves: "moves2"
}

const newGameStatePlayer1 = {
  ...gameState,
  first_move: true,
  color: 1
}

const newGameStatePlayer2 = {
  ...gameState,
  first_move: false,
  color: 2
}

const movePieceGameState = {
  chessboard: [],
  chesspieces1: [],
  chesspieces2: [],
  graveyard: [],
  success: true
}


test("Start game with first move", async () => {
  newMatch.mockResolvedValue(newGameStatePlayer1)
  const game = new Game()
  await game.init()

  expect(SpriteManager.mock.instances[0].enable_move.mock.calls.length).toBe(1)
  expect(SpriteManager.mock.instances[0].enable_move.mock.calls[0][0])
  .toBe(newGameStatePlayer1.moves)
})


test("Start game without first move", async () => {
  newMatch.mockResolvedValue(newGameStatePlayer2)
  getGameState.mockResolvedValue(gameState)

  const game = new Game()
  await game.init()

  expect(SpriteManager.mock.instances[0].enable_move.mock.calls.length).toBe(1)
  expect(SpriteManager.mock.instances[0].enable_move.mock.calls[0][0])
  .toEqual("flippedMoves")
})


test("Move piece then wait for opponent", async () => {
  newMatch.mockResolvedValue(newGameStatePlayer1)
  const game = new Game()
  await game.init()

  send_move_to_server.mockResolvedValue(movePieceGameState)
  getGameState.mockResolvedValue(gameState2)
  await game.move_piece('id', 1, 1)

  expect(SpriteManager.mock.instances[0].enable_move.mock.calls.length).toBe(2)
  expect(SpriteManager.mock.instances[0].enable_move.mock.calls[1][0])
  .toBe(gameState2.moves)
})


test("Display 'You win' if opponent checkmate after making move", async () => {
  newMatch.mockResolvedValue(newGameStatePlayer1)
  const game = new Game()
  await game.init()

  const moveMatchStateCheckmate = {
    ...movePieceGameState,
    checkmate: true
  }
  send_move_to_server.mockResolvedValue(moveMatchStateCheckmate)
  await game.move_piece('id', 1, 1)

  expect(setMessage.mock.calls.length).toBe(1)
  expect(setMessage.mock.calls[0][0]).toBe('You win')
})


test("Display 'Stalemate' if stalemate after making move", async () => {
  newMatch.mockResolvedValue(newGameStatePlayer1)
  const game = new Game()
  await game.init()

  const moveMatchStateStalemate = {
    ...movePieceGameState,
    stalemate: true
  }
  send_move_to_server.mockResolvedValue(moveMatchStateStalemate)
  await game.move_piece('id', 1, 1)

  expect(setMessage.mock.calls.length).toBe(1)
  expect(setMessage.mock.calls[0][0]).toBe('Stalemate')
})


test("Clear display message if neither checkmate nor stalemate after making move", async () => {
  newMatch.mockResolvedValue(newGameStatePlayer1)
  const game = new Game()
  await game.init()

  send_move_to_server.mockResolvedValue(movePieceGameState)
  getGameState.mockResolvedValue(gameState2)
  await game.move_piece('id', 1, 1)

  expect(setMessage.mock.calls.length).toBe(2)
  expect(setMessage.mock.calls[0][0]).toBe('')
})


test("Display 'Check' if checked after opponent move", async () => {
  newMatch.mockResolvedValue(newGameStatePlayer2)

  const newGameStateCheck = {
    ...gameState,
    check: true
  }
  getGameState.mockResolvedValue(newGameStateCheck)

  const game = new Game()
  await game.init()

  expect(setMessage.mock.calls.length).toBe(1)
  expect(setMessage.mock.calls[0][0]).toBe('Check')
})


test("Display 'Checkmate' if checkmate after opponent move", async () => {
  newMatch.mockResolvedValue(newGameStatePlayer2)

  const newGameStateCheckmate = {
    ...gameState,
    checkmate: true
  }
  getGameState.mockResolvedValue(newGameStateCheckmate)

  const game = new Game()
  await game.init()

  expect(setMessage.mock.calls.length).toBe(1)
  expect(setMessage.mock.calls[0][0]).toBe('Checkmate')
})


test("Display 'Stalemate' if stalemate after opponent move", async () => {
  newMatch.mockResolvedValue(newGameStatePlayer2)

  const newGameStateStalemate = {
    ...gameState,
    stalemate: true
  }
  getGameState.mockResolvedValue(newGameStateStalemate)

  const game = new Game()
  await game.init()

  expect(setMessage.mock.calls.length).toBe(1)
  expect(setMessage.mock.calls[0][0]).toBe('Stalemate')
})


test("Clear display message if not check or checkmate or stalemate after opponent move", async () => {
  newMatch.mockResolvedValue(newGameStatePlayer2)

  getGameState.mockResolvedValue(gameState)

  const game = new Game()
  await game.init()

  expect(setMessage.mock.calls.length).toBe(1)
  expect(setMessage.mock.calls[0][0]).toBe('')
})
