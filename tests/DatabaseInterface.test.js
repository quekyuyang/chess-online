const DatabaseInterface = require("../DatabaseInterface.js")


test('Test find match when match is not pending insertion in database', () => {
  const database_interface = new DatabaseInterface()
  database_interface._find_match_database = () => {
    return Promise.resolve('match_data')
  }

  return database_interface.find_match('test_id').then(match_data => {
    expect(match_data).toBe('match_data')
  })
})

test('find_match is rejected if new match is pending for too long', () => {
  const database_interface = new DatabaseInterface()
  database_interface._find_match_database = () => {
    return Promise.resolve('match_data')
  }

  database_interface.pending_match_ids = new Set(['test_id'])
  return expect(database_interface.find_match('test_id')).rejects.toMatch('timeout')
})

test('find_match is fulfilled if new match is not pending anymore', () => {
  const database_interface = new DatabaseInterface()
  database_interface._find_match_database = () => {
    return Promise.resolve('match_data')
  }

  database_interface.pending_match_ids = new Set(['test_id'])
  const promise = database_interface.find_match('test_id').then(match_data => {
    expect(match_data).toBe('match_data')
  })
  database_interface.pending_match_ids.delete('test_id')
  return promise
})
