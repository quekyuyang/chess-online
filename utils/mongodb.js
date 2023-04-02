const { MongoClient } = require("mongodb")


function get_matches_mongodb(connection_str) {
  const client = new MongoClient(
    `mongodb+srv://user1:${process.env.MONGOOSE_PASS}\
@cluster0.sloa7os.mongodb.net/?retryWrites=true&w=majority`
  )
  client.connect(function (client) {})
  const database = client.db('chess-online')
  return database.collection('matches')
}

function get_users_mongodb(connection_str) {
  const client = new MongoClient(
    `mongodb+srv://user1:${process.env.MONGOOSE_PASS}\
@cluster0.sloa7os.mongodb.net/?retryWrites=true&w=majority`
  )
  client.connect(function (client) {})
  const database = client.db('chess-online')
  return database.collection('users')
}


module.exports = {get_matches_mongodb, get_users_mongodb}
