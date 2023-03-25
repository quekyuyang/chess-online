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
  let newGameStatePlayer1
  let newGameStatePlayer2
  let movePieceGameState

  beforeEach(() => {
    SpriteManager.mockClear()
    setMessage.mockClear()

    gameState = {
      chesspieces1: [{id: 'id', _pos: {x: 0, y: 0}}],
      chesspieces2: [],
      moves: {id: []}
    }
    
    gameState2 = {
      chesspieces1: [],
      chesspieces2: [],
      moves: "moves2"
    }
    
    newGameStatePlayer1 = {
      ...gameState,
      first_move: true,
      color: 1
    }
    
    newGameStatePlayer2 = {
      ...gameState,
      first_move: false,
      color: 2
    }
    
    movePieceGameState = {
      chesspieces1: [],
      chesspieces2: [],
      success: true
    }
  })


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

    expect(flipPositions).toHaveBeenCalledWith(gameState)
    expect(SpriteManager.mock.instances[0].enable_move).toHaveBeenCalledWith(gameState.moves)
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
})


describe("", () => {
  let game
  let gameState
  let gameState2
  let gameState3
  let waitForUpdateData

  beforeEach(async () => {
    update.mockClear()

    // Mock newMatch
    gameState = {
      chesspieces1: [{id: 'id1', _pos: {x: 4, y: 4}}],
      chesspieces2: [],
      graveyard: [],
    }
    const newMatchData = {
      ...gameState,
      moves: {
        id1: [{pos: {x: 1, y: 1}}]
      },
      first_move: true,
      color: 1
    }
    newMatch.mockResolvedValue(newMatchData)
    game = new Game()
    await game.init()

    // Mock send_move_to_server
    gameState2 = {
      chesspieces1: [{id: 'id1', _pos: {x: 1, y: 1}}],
      chesspieces2: [],
      graveyard: [],
    }
    const movePieceData = {
      ...gameState2,
      success: true
    }
    send_move_to_server.mockResolvedValue(movePieceData)

    gameState3 = {
      chesspieces1: [{id: 'id1', _pos: {x: 1, y: 1}}],
      chesspieces2: [],
      graveyard: []
    }

    // Mock getGameState
    waitForUpdateData = {
      ...gameState3,
      moves: "moves2",
    }
    getGameState.mockResolvedValue(waitForUpdateData)
  })


  test("Render update with initial game state", async () => {
    expect(update).toBeCalledWith(gameState.chesspieces1.concat(gameState.chesspieces2), gameState.graveyard)
  })

  test("Render update immediately after moving piece", async () => {
    const targetChesspiece = gameState.chesspieces1[0]
    await game.move_piece(targetChesspiece.id, 1, 1)

    const movePieceStateExpect = {
      chesspieces1: [targetChesspiece],
      chesspieces2: [],
      graveyard: []
    }

    expect(update).nthCalledWith(2, movePieceStateExpect.chesspieces1.concat(movePieceStateExpect.chesspieces2), movePieceStateExpect.graveyard)
    expect(update).nthCalledWith(4, waitForUpdateData.chesspieces1.concat(waitForUpdateData.chesspieces2), waitForUpdateData.graveyard)
  })
})


describe("", () => {
  let game
  let gameState
  let gameState2
  let gameState3
  let waitForUpdateData

  beforeEach(async () => {
    update.mockClear()

    // Mock newMatch
    gameState = {
      chesspieces1: [
        {id: 'wking', _pos: {x: 4, y: 7}},
        {id: 'wrook1', _pos: {x: 0, y: 7}}
      ],
      chesspieces2: [],
      graveyard: []
    }
    const newMatchData = {
      ...gameState,
      moves: {
        wking: [{pos: {x: 2, y: 7}, castlingPartner: {id: 'wrook1', move: {pos: {x: 3, y: 7}}}}]
      },
      first_move: true,
      color: 1
    }
    newMatch.mockResolvedValue(newMatchData)
    game = new Game()
    await game.init()

    // Mock send_move_to_server
    gameState2 = {
      chesspieces1: [{id: 'id1', _pos: {x: 2, y: 7}}],
      chesspieces2: [],
      graveyard: [],
    }
    const movePieceData = {
      ...gameState2,
      success: true
    }
    send_move_to_server.mockResolvedValue(movePieceData)

    gameState3 = {
      chesspieces1: [{id: 'id1', _pos: {x: 2, y: 7}}],
      chesspieces2: [],
      graveyard: []
    }

    // Mock getGameState
    waitForUpdateData = {
      ...gameState3,
      moves: "moves2",
    }
    getGameState.mockResolvedValue(waitForUpdateData)
  })

  test("Render castling immediately after moving piece", async () => {
    const king = gameState.chesspieces1[0]
    const rook = gameState.chesspieces1[1]
    await game.move_piece(king.id, 2, 7)

    const movePieceStateExpect = {
      chesspieces1: [king, rook],
      chesspieces2: [],
      graveyard: []
    }

    const chesspiecesExpect = [
      {id: 'wking', _pos: {x: 2, y: 7}},
      {id: 'wrook1', _pos: {x:3, y: 7}}
    ]

    expect(update).nthCalledWith(2, chesspiecesExpect, [])
    //expect(update).nthCalledWith(4, waitForUpdateData.chesspieces1.concat(waitForUpdateData.chesspieces2), waitForUpdateData.graveyard)
  })
})
