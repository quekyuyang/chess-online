const queueMatch = require("../helper.js")
jest.mock('../chess/Game')
const newGame = require('../chess/Game')

newGame.mockReturnValue({
  chessboard: {
    chessboard: null
  },
  moves: null})

class FakeReqGenerator {
  constructor() {
    this.count = 0
  }

  new_req() {
    const req = {
      session: {
        id: 'id' + this.count.toString(),
        username: 'user' + this.count.toString()
       }
    }
    this.count++
    return req
  }
}


test("Test matchmaking queue", async () => {
  const req_generator = new FakeReqGenerator()
  const req1 = req_generator.new_req()
  const req2 = req_generator.new_req()
  const req3 = req_generator.new_req()
  const req4 = req_generator.new_req()

  const res1 = { json: jest.fn() }
  const res2 = { json: jest.fn() }
  const res3 = { json: jest.fn() }
  const res4 = { json: jest.fn() }

  const fake_database_interface = {}
  const match_id1 = 'match_id1'
  const match_id2 = 'match_id2'
  fake_database_interface.newMatch = jest.fn()
  .mockResolvedValueOnce(match_id1).mockResolvedValueOnce(match_id2)

  queueMatch(req1, res1, fake_database_interface)
  await queueMatch(req2, res2, fake_database_interface)
  queueMatch(req3, res3, fake_database_interface)
  await queueMatch(req4, res4, fake_database_interface)

  expect(fake_database_interface.newMatch.mock.calls.length).toBe(2)
  expect(fake_database_interface.newMatch.mock.calls[0][1]).toBe(req1.session.id)
  expect(fake_database_interface.newMatch.mock.calls[0][2]).toBe(req2.session.id)
  expect(fake_database_interface.newMatch.mock.calls[1][1]).toBe(req3.session.id)
  expect(fake_database_interface.newMatch.mock.calls[1][2]).toBe(req4.session.id)
  expect(req1.session.match_id).toBe(match_id1)
  expect(req2.session.match_id).toBe(match_id1)
  expect(req3.session.match_id).toBe(match_id2)
  expect(req4.session.match_id).toBe(match_id2)
  expect(res1.json.mock.calls.length).toBe(1)
  expect(res2.json.mock.calls.length).toBe(1)
  expect(res3.json.mock.calls.length).toBe(1)
  expect(res4.json.mock.calls.length).toBe(1)
})
