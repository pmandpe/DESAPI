const config = require('config.json');

var connectionService = require('utils/connection.service')
var Q = require('q');
// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

module.exports = {
    addSubject,
    getAll
};

async function addSubject(subject) {

    var query = {
        "subjectcode": subject.subjectcode,
        "subjectname": subject.subjectname
    };

    var insertedCount = await connectionService.addDocuments(query, "subjectCollection");
    return { "insertCount": insertedCount };
}


async function getAllSubjects() {

    var query = {
        
    };

    var subjects  = await connectionService.getDocuments(query, "subjectCollection");
    return subjects ; 
}




async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
