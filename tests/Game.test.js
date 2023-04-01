import {Game} from "../public/Game.js"
import {update, setMessage} from "../public/render.js"
import {SpriteManager} from "../public/SpriteManager.js"
import {newMatch, send_move_to_server, getGameState} from "../public/server_comms.js"
import {flipPositions} from "../public/chessboardFlip.js"


jest.mock("../public/render.js")
jest.mock("../public/SpriteManager.js")
jest.mock("../public/server_comms.js")
jest.mock("../public/chessboardFlip.js")


describe('', () => {
  let gameState
  let gameState2
  let newGameState
  let movePieceGameState

  beforeEach(() => {
    gameState = {
      chesspieces1: [{id: 'id', _pos: {x: 0, y: 0}}],
      chesspieces2: [],
      moves: {id: []}
    }
    
    gameState2 = {
      chesspieces1: [],
      chesspieces2: [],
      moves: {}
    }
    
    newGameState = {
      ...gameState,
      first_move: true,
      color: 1
    }

    movePieceGameState = {
      success: true
    }
  })


  test("Start game with first move", async () => {
    newMatch.mockResolvedValue(newGameState)
    const game = new Game()
    await game.init()

    expect(SpriteManager.mock.instances[0].enable_move.mock.calls.length).toBe(1)
    expect(SpriteManager.mock.instances[0].enable_move.mock.calls[0][0])
    .toBe(newGameState.moves)
  })


  test("Start game without first move", async () => {
    const newGameStatePlayer2 = {
      ...gameState2,
      color: 2
    }

    newMatch.mockResolvedValue(newGameStatePlayer2)
    getGameState.mockResolvedValue(gameState)

    const game = new Game()
    await game.init()

    expect(flipPositions).toHaveBeenCalledWith(gameState)
    expect(SpriteManager.mock.instances[0].enable_move).toHaveBeenCalledWith(gameState.moves)
  })


  test("Move piece then wait for opponent", async () => {
    newMatch.mockResolvedValue(newGameState)
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
    newMatch.mockResolvedValue(newGameState)
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
    newMatch.mockResolvedValue(newGameState)
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
    newMatch.mockResolvedValue(newGameState)
    const game = new Game()
    await game.init()

    send_move_to_server.mockResolvedValue(movePieceGameState)
    getGameState.mockResolvedValue(gameState2)
    await game.move_piece('id', 1, 1)

    expect(setMessage.mock.calls.length).toBe(2)
    expect(setMessage.mock.calls[0][0]).toBe('')
  })


  test("Display 'Check' if checked after opponent move", async () => {
    newMatch.mockResolvedValue(newGameState)
    send_move_to_server.mockResolvedValue(movePieceGameState)
    const gameStateCheck = {
      ...gameState,
      check: true
    }
    getGameState.mockResolvedValue(gameStateCheck)

    const game = new Game()
    await game.init()
    await game.move_piece('id', 1, 1)

    expect(setMessage).toBeCalledTimes(2)
    expect(setMessage).nthCalledWith(2, 'Check')
  })


  test("Display 'Checkmate' if checkmate after opponent move", async () => {
    newMatch.mockResolvedValue(newGameState)
    send_move_to_server.mockResolvedValue(movePieceGameState)
    const gameStateCheckmate = {
      ...gameState,
      checkmate: true
    }
    getGameState.mockResolvedValue(gameStateCheckmate)

    const game = new Game()
    await game.init()
    await game.move_piece('id', 1, 1)

    expect(setMessage).toBeCalledTimes(2)
    expect(setMessage).nthCalledWith(2, 'Checkmate')
  })


  test("Display 'Stalemate' if stalemate after opponent move", async () => {
    newMatch.mockResolvedValue(newGameState)
    send_move_to_server.mockResolvedValue(movePieceGameState)
    const gameStateStalemate = {
      ...gameState,
      stalemate: true
    }
    getGameState.mockResolvedValue(gameStateStalemate)

    const game = new Game()
    await game.init()
    await game.move_piece('id', 1, 1)

    expect(setMessage).toBeCalledTimes(2)
    expect(setMessage).nthCalledWith(2, 'Stalemate')
  })


  test("Clear display message if not check or checkmate or stalemate after opponent move", async () => {
    newMatch.mockResolvedValue(newGameState)
    send_move_to_server.mockResolvedValue(movePieceGameState)
    getGameState.mockResolvedValue(gameState)

    const game = new Game()
    await game.init()
    await game.move_piece('id', 1, 1)

    expect(setMessage).toBeCalledTimes(2)
    expect(setMessage).nthCalledWith(2, '')
  })

  afterEach(() => {
    update.mockClear()
    SpriteManager.mockClear()
    setMessage.mockClear()
  })
})


test("Render update with initial game state", async () => {
  const id = 'id1'
  const dest = {x: 4, y: 4}

  // Mock newMatch
  const newMatchData = {
    chesspieces1: [{id: id, _pos: dest}],
    chesspieces2: [],
    graveyard: [],
    moves: {
      [id]: [{pos: dest}]
    },
    color: 1
  }

  newMatch.mockResolvedValue(newMatchData)
  const game = new Game()
  await game.init()

  expect(update).toBeCalledWith(newMatchData.chesspieces1.concat(newMatchData.chesspieces2), newMatchData.graveyard)
})

test("Render update after opponent move", async () => {
  const id = 'id1'
  const dest = {x: 4, y: 4}

  // Mock newMatch
  const newMatchData = {
    chesspieces1: [{id: id, _pos: dest}],
    chesspieces2: [],
    graveyard: [],
    moves: {
      [id]: [{pos: dest}]
    },
    color: 1
  }

  newMatch.mockResolvedValue(newMatchData)
  const game = new Game()
  await game.init()

  // Mock getGameState
  const gameState2 = {
    chesspieces1: [{id: id, _pos: dest}],
    chesspieces2: [],
    graveyard: [],
    moves: "moves2",
  }
  getGameState.mockResolvedValue(gameState2)

  const targetChesspiece = newMatchData.chesspieces1[0]
  await game.move_piece(targetChesspiece.id, dest.x, dest.y)

  expect(update).nthCalledWith(3, gameState2.chesspieces1.concat(gameState2.chesspieces2), gameState2.graveyard)
})

describe("Chessboard render updates immediately after player move", () => {
  let gameState2
  let newMatchData

  beforeEach(async () => {
    newMatchData = {
      chesspieces1: [],
      chesspieces2: [],
      graveyard: [],
      moves: {},
      color: 1
    }

    // Mock getGameState
    // Beyond test scope, so value can be whatever
    gameState2 = {
      chesspieces1: [],
      chesspieces2: [],
      graveyard: [],
      moves: "",
    }
    getGameState.mockResolvedValue(gameState2)
  })

  test("Render update immediately after moving piece", async () => {
    const id = 'id1'
    const dest = {x: 4, y: 4}

    // Mock newMatch
    newMatchData.chesspieces1.push({id: id, _pos: dest})
    newMatchData.moves[id] = [{pos: dest}]
    newMatch.mockResolvedValue(newMatchData)

    const game = new Game()
    await game.init()

    const targetChesspiece = newMatchData.chesspieces1[0]
    await game.move_piece(targetChesspiece.id, dest.x, dest.y)

    const movePieceStateExpect = {
      chesspieces1: [targetChesspiece],
      chesspieces2: [],
      graveyard: []
    }

    expect(update).nthCalledWith(2, movePieceStateExpect.chesspieces1.concat(movePieceStateExpect.chesspieces2), movePieceStateExpect.graveyard)
  })

  test("Render castling immediately after moving piece", async () => {
    const kingID = 'wking'
    const rookID = 'wrook1'
    const kingDest = {x: 2, y: 7}
    const rookDest = {x: 3, y: 7}

    // Mock newMatch
    newMatchData.chesspieces1.push({id: kingID, _pos: {x: 4, y: 7}})
    newMatchData.chesspieces1.push({id: rookID, _pos: {x: 0, y: 7}})
    newMatchData.moves[kingID] = [{pos: kingDest, castlingPartner: {id: rookID, move: {pos: rookDest}}}]
    newMatch.mockResolvedValue(newMatchData)

    const game = new Game()
    await game.init()

    const king = newMatchData.chesspieces1[0]
    await game.move_piece(king.id, kingDest.x, kingDest.y)

    const chesspiecesExpect = [
      {id: kingID, _pos: kingDest},
      {id: rookID, _pos: rookDest}
    ]

    expect(update).nthCalledWith(2, chesspiecesExpect, [])
  })

  test("Update graveyard immediately after moving piece", async () => {
    const wrookID = 'wrook1'
    const brookID = 'brook1'
    const wrookDest = {x: 5, y: 7}
    const toBeCaptured = {id: brookID, _pos: wrookDest}

    // Mock newMatch
    newMatchData.chesspieces1.push({id: wrookID, _pos: {x: 4, y: 7}})
    newMatchData.chesspieces2.push(toBeCaptured)
    newMatchData.moves[wrookID] = [{pos: wrookDest, capture: toBeCaptured}]
    newMatch.mockResolvedValue(newMatchData)

    const game = new Game()
    await game.init()

    const rook = newMatchData.chesspieces1[0]
    await game.move_piece(rook.id, wrookDest.x, wrookDest.y)

    const chesspiecesExpect = [
      {id: wrookID, _pos: wrookDest},
      {id: brookID, _pos: wrookDest}
    ]

    expect(update).nthCalledWith(2, chesspiecesExpect, [toBeCaptured])
  })

  afterEach(() => {
    update.mockClear()
  })
})
