const config = require('config.json');

var connectionService = require('utils/connection.service')
var Q = require('q');
// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

module.exports = {
    saveSubject,
    getAllSubjects,
    getSubjectDetails
};

async function saveSubject(subject) {
    var uniqueIdQuery = {"subjectcode": subject.subjectcode}
    var addDoc =  {
        
        "subjectname": subject.subjectname,
        "subjectclass": subject.subjectclass,
        "examyear": subject.examyear,
    }
    var updateCount = 0 ;
    var setQuery = {
        $set: addDoc     
    };
    if (subject.editmode == 'NEW'){
        addDoc.subjectcode = subject.subjectcode ;
        updateCount = await connectionService.addDocuments(addDoc, "subjectCollection");
    }
    if (subject.editmode == 'EDIT'){
        updateCount = await connectionService.updateDocument(uniqueIdQuery, setQuery,  "subjectCollection");
    }
    if (updateCount == 11000) {//its a duplicate error
        return { "updateCount": updateCount, "error" : "This subject code already exist. Please try a different one." };
    }
}


async function getAllSubjects() {

    var query = {
        
    };

    var subjects  = await connectionService.getDocuments(query, "subjectCollection");
    return subjects ; 
}


async function getSubjectDetails(subjectcode) {

    var query = {
        "subjectcode" : subjectcode 
    };

    var subject  = await connectionService.getDocuments(query, "subjectCollection");
    return subject ; 
}




async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}
