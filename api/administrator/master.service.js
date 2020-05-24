const config = require('config.json');
const role = require("_helpers/roles");

var connectionService = require('utils/connection.service')
var Q = require('q');
// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];


module.exports = {
    saveSubject,
    getAllSubjects,
    getSubjectDetails,
    getUsers,
    getUserDetails,
    saveUser,
    getPendingEvaluators,
    approveUsers,
    changePassword

};

async function saveSubject(subject) {
    try {
        var uniqueIdQuery = { "subjectcode": subject.subjectcode }
        var addDoc = {

            "subjectname": subject.subjectname,
            "subjectclass": subject.subjectclass,
            "examyear": subject.examyear,
            "semester": subject.semester,
            "stream": subject.stream
        }
        var updateCount = 0;
        var setQuery = {
            $set: addDoc
        };
        if (subject.editmode == 'NEW') {
            addDoc.subjectcode = subject.subjectcode;
            updateCount = await connectionService.addDocuments(addDoc, "subjectCollection");
            if (updateCount == 1) { //-- successfull update{
                return { "updateCount": 1, "message": "Data Updated Successfully." };
            }
        }
        if (subject.editmode == 'EDIT') {
            updateCount = await connectionService.updateDocument(uniqueIdQuery, setQuery, "subjectCollection");
        }
        if (updateCount > 1) {//its a duplicate error
            return { "updateCount": -1, "error": "This subject code already exist. Please try a different one." };
        }
        else {
            return { "updateCount": 1, "message": "Data updated successfully." };
        }
    }
    catch (exception) {
        return { "updateCount": -1, "error": "Error in updating subject. Please contact system administrator with error : " + exception };
    }
}


async function getAllSubjects() {
    var query = {};
    var subjects = await connectionService.getDocuments(query, "subjectCollection");
    return subjects;
}



async function getUserDetails(userName) {

    var query = {
        "username": userName
    };
    var users = await connectionService.getDocuments(query, "userCollection");
    return users;
}


async function saveUser(user) {
    try {
        var uniqueIdQuery = { "username": user.username }
        var addDoc = {

            "username": user.username,
            "name": user.name,
            "emailid": user.emailid,
            "isactive": user.isactive,
            "role": user.role
        }

        if (user.role == role.Scanner){
            addDoc = setScanningDetails(user, addDoc)
        }

        if (user.pwd){
            addDoc.pwd = user.pwd ; 
        }
        var updateCount = 0;
        var setQuery = {
            $set: addDoc
        };
        if (user.editmode == 'NEW') {
            updateCount = await connectionService.addDocuments(addDoc, "userCollection");
            if (updateCount == 1) { //-- successfull update{
                return { "updateCount": 1, "message": "Data Updated Successfully." };
            }
        }
        if (user.editmode == 'EDIT') {
            updateCount = await connectionService.updateDocument(uniqueIdQuery, setQuery, "userCollection");
        }
        if (updateCount > 1) {//its a duplicate error
            return { "updateCount": -1, "error": "This User Name already exist. Please try a different one." };
        }
        else {
            return { "updateCount": 1, "message": "Data updated successfully." };
        }
    }
    catch (exception) {
        console.log(exception);
        return { "updateCount": -1, "error": "Error in updating user. Please contact system administrator with error : " + exception };
    }
}


function setScanningDetails(paramUser, setDoc){
    setDoc.officecode = paramUser.officecode ;
    setDoc.officename = paramUser.officename ; 
    setDoc.address = paramUser.address ; 
    setDoc.contactperson = paramUser.contactperson ; 
    setDoc.cell = paramUser.cell ;
    setDoc.phone = paramUser.phone ; 
    return setDoc ; 
}

async function getAllSubjects() {

    var query = {

    };

    var subjects = await connectionService.getDocuments(query, "subjectCollection");
    return subjects;
}

async function getSubjectDetails(subjectcode) {

    var query = {
        "subjectcode": subjectcode
    };

    var subject = await connectionService.getDocuments(query, "subjectCollection");
    return subject;
}




async function getUsers() {
    var query = {"role": { $in : [role.Evaluator, role.Scanner]}  };
    var columnList = { pwd: 0 }
    var users = await connectionService.getDocuments(query, "userCollection", columnList);
    return users;
}


async function getPendingEvaluators() {

    var query = { "role": role.Evaluator, "isactive": "N" };

    var columnList = { pwd: 0 }
    var users = await connectionService.getDocuments(query, "userCollection", columnList);
    return users;
}


function getUserByStatus(allUsers, isActive) {

    var usersByStatus = allUsers.filter(function (user) {
        return user.isactive == isActive;
    });

    return usersByStatus;

}

function getInUsers(activeUsers){
    var inUsers = [] ;
    activeUsers.forEach(user=>{
        inUsers.push(user.username) ;
    })
    return inUsers; 
}

async function saveActiveInactiveUsers(Users, activeFlag){
    var activeUsers = getUserByStatus(Users, activeFlag);

    var inUsers = getInUsers(activeUsers) ;

    var uniqueIdQuery = { "username" : {$in: inUsers }} ;
    var updateQuery = {
        "isactive": activeFlag
    }
    var updateCount = 0;
    var setQuery = {
        $set: updateQuery
    };
    updateCount = await connectionService.updateMany(uniqueIdQuery, setQuery, "userCollection");
    return updateCount
}



async function approveUsers(Users) {
    try {

        var updateCount = await saveActiveInactiveUsers(Users, 'Y' ) ;
        updateCount = await saveActiveInactiveUsers(Users, 'N' ) ;
        if (updateCount > 0) { //-- successfull update{
            return { "updateCount": 1, "message": "Data Updated Successfully." };
        }
    }
    catch (exception) {
        return { "updateCount": -1, "error": "Error in updating subject. Please contact system administrator with error : " + exception };
    }
}


async function changePassword(username, currentPassword, newPassword){
    try{
    query = {"username" : username, "pwd" : currentPassword } ;
    setQuery = {$set  : {"pwd" : newPassword}} ;
    let updateCount = await connectionService.updateDocument(query, setQuery, "userCollection") ;
    return {"updateCount" : updateCount} ;
    }
    catch(ex){
        console.log(ex) ;
        return {"updateCount": -1};
    } 
}
