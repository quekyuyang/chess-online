const {generatePosKnight} = require('../chess/generatePosKnight');


test('Generate knight positions unconstrained', () => {
  const posStart = {x: 3, y: 2};
  const expectedPosDests = [
    {x:1, y:1},
    {x:1, y:3},
    {x:2, y:4},
    {x:4, y:4},
    {x:5, y:1},
    {x:5, y:3},
    {x:2, y:0},
    {x:4, y:0}
  ];
  const posDests = generatePosKnight(posStart);
  expect(posDests.length).toBe(expectedPosDests.length);
  expect(posDests).toEqual(expect.arrayContaining(expectedPosDests));
});

test('Generate knight positions but limited by chessboard edge', () => {
  const posStart = {x: 3, y: 1};
  const expectedPosDests = [
    {x:1, y:0},
    {x:1, y:2},
    {x:2, y:3},
    {x:4, y:3},
    {x:5, y:0},
    {x:5, y:2}
  ];
  const posDests = generatePosKnight(posStart);
  expect(posDests.length).toBe(expectedPosDests.length);
  expect(posDests).toEqual(expect.arrayContaining(expectedPosDests));
});
