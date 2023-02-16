const {get_users_mongodb} = require("./mongodb")


class UserDatabase {
    constructor() {
        this.users = get_users_mongodb(
            `mongodb+srv://user1:${process.env.MONGOOSE_PASS}\
        @cluster0.sloa7os.mongodb.net/?retryWrites=true&w=majority`)
    }

    newUser(username, password) {
        this.users.insertOne({
            username: username,
            password: password
        })
    }

    authenticate(username, password) {
        return this.users.findOne({username: username})
        .then(result => {
            if (result)
                return password === result.password
            else
                return false
        })
    }
}

module.exports = UserDatabase