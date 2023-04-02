const {get_users_mongodb} = require("./mongodb")
const bcrypt = require('bcryptjs')


class UserDatabase {
    constructor() {
        this.users = get_users_mongodb(
            `mongodb+srv://user1:${process.env.MONGOOSE_PASS}\
        @cluster0.sloa7os.mongodb.net/?retryWrites=true&w=majority`)
    }

    newUser(username, password) {
        this.users.findOne({username: username})
        .then((result) => {
            if (result === null)
                return bcrypt.hash(password, 10)
        })
        .then((hash) => {
            if (hash) {
                return this.users.insertOne({
                    username: username,
                    password: hash
                })
            }
        })
    }

    authenticate(username, password) {
        return this.users.findOne({username: username})
        .then(user => {
            if (!user)
                return false

            return bcrypt.compare(password, user.password)
        })
    }
}

module.exports = UserDatabase