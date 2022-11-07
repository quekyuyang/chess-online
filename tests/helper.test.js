const queue_match = require("../helper.js")

test("Test matchmaking", async () => {
  const req1 = {
    session: {
      id: 'id1'
    }
  }
  const req2 = {
    session: {
      id: 'id2'
    }
  }

  const res1 = {
    json: jest.fn()
  }
  const res2 = {
    json: jest.fn()
  }

  const fake_database_interface = {}
  const match_id = 'match_id'
  fake_database_interface.new_match = jest.fn(() => match_id)
  const fake_match_data = {
    chessboard: [],
    graveyard: [],
    moves: {},
    player_ids: [req1.session.id, req2.session.id]
  }
  fake_database_interface.find_match = jest.fn(() => Promise.resolve(fake_match_data))

  queue_match(req1, res1, fake_database_interface)
  await queue_match(req2, res2, fake_database_interface)

  expect(fake_database_interface.new_match.mock.calls.length).toBe(1)
  expect(fake_database_interface.new_match.mock.calls[0][0]).toBe(req1.session.id)
  expect(fake_database_interface.new_match.mock.calls[0][1]).toBe(req2.session.id)
  expect(req1.session.match_id).toBe(match_id)
  expect(req2.session.match_id).toBe(match_id)
  expect(res1.json.mock.calls.length).toBe(1)
  expect(res2.json.mock.calls.length).toBe(1)
  expect(res1.json.mock.calls[0][0]).toStrictEqual({...fake_match_data, first_move:true})
  expect(res2.json.mock.calls[0][0]).toStrictEqual({...fake_match_data, first_move:false})
})
