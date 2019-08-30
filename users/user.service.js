const config = require('config.json');
const jwt = require('jsonwebtoken');
var connectionService = require('utils/connection.service')

// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

module.exports = {
    authenticate,
    getAll
};

async function authenticate({ username, password }) {

   

    const user = users.find(u => u.username === username && u.password === password);

var document = connectionService.getDocuments().then(function(doc){
    console.log(doc) ;
}) ;

    if (user) {
        const token = jwt.sign({ sub: user.id }, config.secret);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
