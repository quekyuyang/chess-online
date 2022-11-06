const Chessboard = require('../chess/Chessboard');
var { Rook, Bishop, Queen, Knight, Pawn, King } = require("../chess/ChessPiece.js")

test('Standard chessboard initialization', () => {
  const chessboard = new Chessboard();
  chessboard.init();

  expect(chessboard.chessboard[0][0]).toBeInstanceOf(Rook);
  expect(chessboard.chessboard[0][7]).toBeInstanceOf(Rook);
  expect(chessboard.chessboard[0][1]).toBeInstanceOf(Knight);
  expect(chessboard.chessboard[0][6]).toBeInstanceOf(Knight);
  expect(chessboard.chessboard[0][2]).toBeInstanceOf(Bishop);
  expect(chessboard.chessboard[0][5]).toBeInstanceOf(Bishop);
  expect(chessboard.chessboard[0][3]).toBeInstanceOf(Queen);
  expect(chessboard.chessboard[0][4]).toBeInstanceOf(King);

  expect(chessboard.chessboard[7][0]).toBeInstanceOf(Rook);
  expect(chessboard.chessboard[7][7]).toBeInstanceOf(Rook);
  expect(chessboard.chessboard[7][1]).toBeInstanceOf(Knight);
  expect(chessboard.chessboard[7][6]).toBeInstanceOf(Knight);
  expect(chessboard.chessboard[7][2]).toBeInstanceOf(Bishop);
  expect(chessboard.chessboard[7][5]).toBeInstanceOf(Bishop);
  expect(chessboard.chessboard[7][3]).toBeInstanceOf(Queen);
  expect(chessboard.chessboard[7][4]).toBeInstanceOf(King);
});

test('Initialize chessboard from data object', () => {
  const chesspieces1_data = [
    {player: 1, _pos: {x: 3, y: 4}, move_type: 'rook', id: '1'},
    {player: 1, _pos: {x: 5, y: 4}, move_type: 'knight', id: '2'},
    {player: 1, _pos: {x: 3, y: 3}, move_type: 'pawn', id: '7', has_moved: true, vulnerable_to_enpassant: true}
  ]

  const chesspieces2_data = [
    {player: 2, _pos: {x: 3, y: 6}, move_type: 'rook', id: '3'},
    {player: 2, _pos: {x: 5, y: 6}, move_type: 'knight', id: '4'},
    {player: 2, _pos: {x: 0, y: 1}, move_type: 'pawn', id: '8', has_moved: false, vulnerable_to_enpassant: false}
  ]

  const graveyard_data = [
    {player: 1, _pos: {x: 3, y: 6}, move_type: 'rook', id: '5'},
    {player: 2, _pos: {x: 5, y: 6}, move_type: 'knight', id: '6'}
  ]

  const chessboard = new Chessboard(chesspieces1_data, chesspieces2_data, graveyard_data);
  expect(chessboard.chesspieces1).toMatchObject(chesspieces1_data);
  expect(chessboard.chesspieces2).toMatchObject(chesspieces2_data);
  expect(chessboard.graveyard).toMatchObject(graveyard_data);
})

test('Add chess piece to chessboard', () => {
  const chessboard = new Chessboard();
  chessboard.add_rook(1, {x: 3, y: 4})
  expect(chessboard.chessboard[4][3]).toBeInstanceOf(Rook);
  expect(chessboard.chessboard[4][3]).toHaveProperty('player', 1);
});

test('Move chess piece on chessboard', () => {
  const chessboard = new Chessboard();
  chessboard.add_rook(1, {x: 3, y: 4})
  chessboard.move_piece(4, 3, {pos: {y: 7, x: 3}});

  expect(chessboard.chessboard[4][3]).toBeNull();
  expect(chessboard.chessboard[7][3]).toBeInstanceOf(Rook);
  expect(chessboard.chessboard[7][3]).toHaveProperty('player', 1);
});

test('Capture chess piece by moving to captive position', () => {
  const chessboard = new Chessboard();
  chessboard.add_rook(1, {x: 3, y: 4})
  chessboard.add_rook(2, {x: 3, y: 0})
  const capturer = chessboard.chessboard[4][3];
  const captive = chessboard.chessboard[0][3];

  chessboard.move_piece(4, 3, {pos: {y: 0, x: 3}, capture: captive});

  expect(chessboard.chessboard[4][3]).toBeNull();
  expect(chessboard.chessboard[0][3]).toBe(capturer);
  expect(chessboard.graveyard[0]).toBe(captive);
});

test('Capture chess piece without moving to captive position (en passant)', () => {
  const chessboard = new Chessboard();
  chessboard.add_pawn(1, {x: 4, y: 3})
  chessboard.add_pawn(2, {x: 3, y: 3})
  const capturer = chessboard.chessboard[3][4];
  const captive = chessboard.chessboard[3][3];

  chessboard.move_piece(3, 4, {pos: {x: 4, y: 2}, capture: captive});

  expect(chessboard.chessboard[3][4]).toBeNull();
  expect(chessboard.chessboard[2][4]).toBe(capturer);
  expect(chessboard.chessboard[3][3]).toBeNull();
  expect(chessboard.graveyard[0]).toBe(captive);
});
