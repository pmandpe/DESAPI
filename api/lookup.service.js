const config = require('config.json');

var connectionService = require('utils/connection.service')
var Q = require('q');


module.exports = {
    getAllSubjects,
    getAllScanners,
    getAll
};

async function getAllSubjects() {
    var query = {};
    var subjectDocuments = await connectionService.getDocuments(query, "subjectCollection");
    return subjectDocuments ;
}

async function getAllScanners() {
    var query = {"role": "SCANNER"};
    var sacnnerList = await connectionService.getDocuments(query, "userCollection");
    return sacnnerList ;
}




async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
