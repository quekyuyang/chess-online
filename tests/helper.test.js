const queue_match = require("../helper.js")


class FakeReqGenerator {
  constructor() {
    this.count = 0
  }

  new_req() {
    const req = {
      session: { id: 'id' + this.count.toString() }
    }
    this.count++
    return req
  }
}

function create_fake_match_data(id1, id2) {
  return {
    chessboard: [],
    graveyard: [],
    moves: {},
    player_ids: [id1, id2]
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
  fake_database_interface.new_match = jest.fn()
  .mockReturnValueOnce(match_id1).mockReturnValueOnce(match_id2)
  
  const fake_match_data1 = create_fake_match_data(req1.session.id, req2.session.id)
  const fake_match_data2 = create_fake_match_data(req3.session.id, req4.session.id)
  fake_database_interface.find_match = jest.fn()
  .mockResolvedValueOnce(fake_match_data1).mockResolvedValueOnce(fake_match_data2)

  queue_match(req1, res1, fake_database_interface)
  await queue_match(req2, res2, fake_database_interface)
  queue_match(req3, res3, fake_database_interface)
  await queue_match(req4, res4, fake_database_interface)

  expect(fake_database_interface.new_match.mock.calls.length).toBe(2)
  expect(fake_database_interface.new_match.mock.calls[0][0]).toBe(req1.session.id)
  expect(fake_database_interface.new_match.mock.calls[0][1]).toBe(req2.session.id)
  expect(fake_database_interface.new_match.mock.calls[1][0]).toBe(req3.session.id)
  expect(fake_database_interface.new_match.mock.calls[1][1]).toBe(req4.session.id)
  expect(req1.session.match_id).toBe(match_id1)
  expect(req2.session.match_id).toBe(match_id1)
  expect(req3.session.match_id).toBe(match_id2)
  expect(req4.session.match_id).toBe(match_id2)
  expect(res1.json.mock.calls.length).toBe(1)
  expect(res2.json.mock.calls.length).toBe(1)
  expect(res3.json.mock.calls.length).toBe(1)
  expect(res4.json.mock.calls.length).toBe(1)
  expect(res1.json.mock.calls[0][0]).toStrictEqual({...fake_match_data1, first_move:true})
  expect(res2.json.mock.calls[0][0]).toStrictEqual({...fake_match_data1, first_move:false})
  expect(res3.json.mock.calls[0][0]).toStrictEqual({...fake_match_data2, first_move:true})
  expect(res4.json.mock.calls[0][0]).toStrictEqual({...fake_match_data2, first_move:false})
})
