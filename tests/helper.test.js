const queue_match = require("../helper.js")

test("Test matchmaking", () => {
  const fake_database_interface = {}
  const match_id = 'match_id'
  fake_database_interface.new_match = () => match_id

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

  queue_match(req1, res1, fake_database_interface)
  queue_match(req2, res2, fake_database_interface)

  expect(req1.session.match_id).toBe(match_id)
  expect(req2.session.match_id).toBe(match_id)
  expect(res1.json.mock.calls.length).toBe(1)
  expect(res2.json.mock.calls.length).toBe(1)
  expect(res1.json.mock.calls[0][0].opponent).toBe(req2.session.id)
  expect(res2.json.mock.calls[0][0].opponent).toBe(req1.session.id)
})
