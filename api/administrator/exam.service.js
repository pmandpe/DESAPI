const config = require('config.json');
const utilities = require('utils/utilities.service')
var fs = require('fs-extra')

var connectionService = require('utils/connection.service')
var Q = require('q');
// users hardcoded for simplicity, store in a db for production applications
const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

module.exports = {
    saveExam,
    getAllExams,
    getExamDetails,
    getUniqueCode,
    saveScanningAssignment,
    saveEvaluationAssignment,
    saveQuestion
};

async function saveExam(exam, userid) {
    var uniqueIdQuery = { "examcode": exam.examcode }
    var addDoc = {

        "examname": exam.examname,
        "admin_user": userid,
        "subjectcode": exam.subjectcode,
        "examdate": exam.examdate,
        "resultdate": exam.resultdate,
        "numberofcopies": exam.numberofcopies,
        "scannedcopies": exam.scannedcopies,
        "modified_date": new Date(),
        "modified_by": userid,
        "comments": exam.comments
    }
    var updateCount = 0;
    var setQuery = {
        $set: addDoc
    };
    if (exam.editmode == 'NEW') {
        addDoc.examcode = this.getUniqueCode(exam.examname);
        addDoc.createdby = userid;
        addDoc.createddate = new Date();
        addDoc.scanningassignment = [] ;
        addDoc.evaluationassignment = [] ;
        addDoc.status = "NEW";
        updateCount = await connectionService.addDocuments(addDoc, "examCollection");
    }
    if (exam.editmode == 'EDIT') {
        updateCount = await connectionService.updateDocument(uniqueIdQuery, setQuery, "subjectCollection");
    }
    if (updateCount == 11000) {//its a duplicate error
        return { "updateCount": updateCount, "error": "This subject code already exist. Please try a different one." };
    }
}


async function getAllExams() {

    var query = {

    };

    var exams = await connectionService.getDocuments(query, "examCollection");
    return exams;
}


async function getExamDetails(examcode) {

    var query = {
        "examcode": examcode
    };

    var examDetails = await connectionService.getDocuments(query, "examCollection");
    return examDetails;
}




async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

function getUniqueCode(examname) {
    var exName = examname.replace(/\s/g, "");
    var prefix = (exName.substring(0, 3)).toUpperCase();
    return prefix + "-" + utilities.generateUniqueCode();
}



async function saveScanningAssignment(scanningData, userid) {
    var uniqueIdQuery = { "examcode": scanningData.examcode }
    var addDoc = {
        "scanningassignment": scanningData.scanningassignment,
        "totalcopiesassignedforscanning": scanningData.totalcopiesassignedforscanning,
        "modified_by": userid,
        "modified_date": new Date()
    }
    var updateCount = 0;
    var setQuery = {
        $set: addDoc
    };

    updateCount = await connectionService.updateDocument(uniqueIdQuery, setQuery, "examCollection");
    if (updateCount == 11000) {//its a duplicate error
        return { "updateCount": updateCount, "error": "This subject code already exist. Please try a different one." };
    }
}



async function saveEvaluationAssignment(evaluationData, userid) {
    var uniqueIdQuery = { "examcode": evaluationData.examcode }
    var addDoc = {
        "evaluationassignment": evaluationData.evaluationassignment,
        "totalcopiesassignedforevaluation": evaluationData.totalcopiesassignedforevaluation,
        "modified_by": userid,
        "modified_date": new Date()
    }
    var updateCount = 0;
    var setQuery = {
        $set: addDoc
    };

    updateCount = await connectionService.updateDocument(uniqueIdQuery, setQuery, "examCollection");
    if (updateCount == 11000) {//its a duplicate error
        return { "updateCount": updateCount, "error": "Error in assigning for scanning." };
    }
    else{
        //cut and paste copies from scanned folder to evaulator's folder.
        var copyFiles = await copyAssignedCopiesToUserFolder(userid, evaluationData.examcode)
    }
}


async function copyAssignedCopiesToUserFolder(userid, examcode){
    var dir = config.fileLocation + userid  ;
    console.log(dir) ;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir) ; // make the parent directory
        fs.mkdirSync(dir + "/scanned") ; // keep all the assigned scanned copies here
        fs.mkdirSync(dir + "/evaluated") ; // keep all the evaluated copies here.
        try{
        var filesCopied = await fs.copy(config.fileLocation + "/" + examcode + "/" + userid, dir + "/scanned") ;
        }
        catch(error){
            console.error("Error in copying files from exam folder to scanned folder")
        }

    }
}



async function saveQuestion(examDetails, questions, userid) {
    var uniqueIdQuery = { "examcode": examDetails.examcode }
    var updateCount = 0;
    
    var setQuery = {
        $set: { "questions" : questions,  "modifiedby" : userid, "modifieddate" : new Date()}
    };
    updateCount = await connectionService.updateDocument(uniqueIdQuery, setQuery, "examCollection");
    if (updateCount == 11000) {//its a duplicate error
        return { "updateCount": updateCount, "error": "This subject code already exist. Please try a different one." };
    }
}