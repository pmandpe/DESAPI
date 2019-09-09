const config = require('config.json');

var connectionService = require('utils/connection.service')
var Q = require('q');


module.exports = {
    getAllSubjects,
    getAllUsers,
    getAll
};

async function getAllSubjects() {
    var query = {};
    var subjectDocuments = await connectionService.getDocuments(query, "subjectCollection");
    return subjectDocuments ;
}

async function getAllUsers(userType) {
    var query = {"role": userType};
    var columnList = { username: 1, firstname: 1, emailid: 1, scanningoffice:1 }
    var sacnnerList = await connectionService.getDocuments(query, "userCollection");
    return sacnnerList ;
}




async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
