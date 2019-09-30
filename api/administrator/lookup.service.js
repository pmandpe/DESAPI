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
    var columnList = { username: 1, firstname: 1, emailid: 1, scanningoffice:1, targetdate: 1, assigneddate:1  }
    var scannerlist = await connectionService.getDocuments(query, "userCollection");

    //-- add additional fields for saving to scanning assignment
    
    return scannerlist ;
}




async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
