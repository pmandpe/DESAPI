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
    var columnList = { username: 1, name: 1,  firstname: 1, emailid: 1, role: 1, isactive: 1 }
    if (userType && userType == "SCANNER"){
        columnList.scanningoffice = 1 ; 
    }
    var userList = await connectionService.getDocuments(query, "userCollection", columnList);

    //-- add additional fields for saving to scanning assignment
    
    return userList ;
}




async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
