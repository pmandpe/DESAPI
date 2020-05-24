const config = require('config.json');
const jwt = require('jsonwebtoken');
var connectionService = require('utils/connection.service')
var Q = require('q');
// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

module.exports = {
    authenticate,
    getAll
};

async function authenticate({ username, password }) {



    //const user = users.find(u => u.username === username && u.password === password);

    var query = {
        "username": username,
        "pwd": password,
        "isactive" :"Y"
    };

    var user = await connectionService.getDocuments(query, "userCollection");
    if (user) {
        if (user.length > 0) {
            const token = jwt.sign({ sub: user[0].id, role: user[0].role, username: user[0].username }, config.secret);
            const { password, ...userWithoutPassword } = user;
            return {
                "username": user[0].username,
                "token": token,
                "role": user[0].role
            };
        }
        return [];
    }



}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

