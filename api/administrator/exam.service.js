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
    saveQuestion,
    clearData,
    getExamDashboard
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
        "scannedcopies": exam.totalscannedcopies,
        "modified_date": new Date(),
        "modified_by": userid,
        "comments": exam.comments,
        "class": exam.class,
        "semester": exam.semester
    }
    var updateCount = 0;
    var setQuery = {
        $set: addDoc
    };
    if (exam.editmode == 'NEW') {
        addDoc.examcode = this.getUniqueCode(exam.examname);
        addDoc.createdby = userid;
        addDoc.createddate = new Date();
        addDoc.scanningassignment = [];
        addDoc.evaluationassignment = [];
        addDoc.status = "NEW";
        updateCount = await connectionService.addDocuments(addDoc, "examCollection");
    }
    if (exam.editmode == 'EDIT') {
        updateCount = await connectionService.updateDocument(uniqueIdQuery, setQuery, "examCollection");
    }
    if (updateCount == 11000) {//its a duplicate error
        return { "updateCount": updateCount, "error": "This subject code already exist. Please try a different one." };
    }
}


async function getAllExams() {
    var exams = await connectionService.getDocuments(query, "examCollection");
    return exams;
}

async function getExamDashboard(){

    var columnList  = {
        "examcode" : 1, 
        "resultdate": 1, 
        "evaluationassignment": 1, 
        "totalcopies": 1,
        "totalcopiesassignedforscanning" : 1,
        "totalscannedcopies": 1,
        "totalcopiesassignedforevaluation" : 1 ,
        "totalevaluatedcopies" : 1

    };

    var exams = await connectionService.getDocuments({}, "examCollection", columnList);
    return exams;
}


async function getExamDetails(examcode, columnList) {

    if (!columnList) {
        columnList = {};
    }

    var query = {
        "examcode": examcode
    };

    var examDetails = await connectionService.getDocuments(query, "examCollection", columnList);
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

    //-- get the answer data against which we have to save the evaluation data


    updateCount = 0;//await connectionService.updateDocument(uniqueIdQuery, setQuery, "examCollection");
    if (updateCount == 11000) {//its a duplicate error
        return { "updateCount": updateCount, "error": "Error in assigning for scanning." };
    }
    else {

        //update data in answers collection

        var examCode = evaluationData.examcode;
        //cut and paste copies from scanned folder to evaulator's folder.
        /*
        const start = async () => {
            await utilities.asyncForEach(evaluationData.evaluationassignment, async  (assignment) => {
                var query = { "examcode": examCode, "isassigned": "N" };
                var answersTobeUpdated = await connectionService.getDocuments(query, "answersCollection", {}, assignment.additionalcopies);
                console.log(JSON.stringify(answersTobeUpdated));
                //var answersToUpdate = await getAnswersForEvaluation(evaluationData.examcode, assignment.additionalcopies);
                //var copyFiles = await copyAssignedCopiesToUserFolder(assignment.username, evaluationData.examcode);
                //-- once files are copied, update the answers collection with username to whom copies are assigned for evaluation
                //-- and set the flag isAssigned to 'Y'
                //var updateCount = await updateAnswersForEvaluation(answersToUpdate, assignment.username);
                //if (updateCount < 0) {
                //    return -1;
                //}
            });
        }
        start() ; 
        */
        try {
            const processData = async _ => {
                console.log("Start");
                for (var i = 0; i < evaluationData.evaluationassignment.length; i++) {
                    var query = { "examcode": examCode, "isassigned": "N" };
                    const answersTobeUpdated = await connectionService.getDocuments(query, "answersCollection", {}, evaluationData.evaluationassignment[i].additionalcopies);

                    var copyFiles = await copyAssignedCopiesToUserFolder(evaluationData.evaluationassignment[i].username, examCode, evaluationData.evaluationassignment[i].additionalcopies);
                    var updateCount = await updateAnswersForEvaluation(answersTobeUpdated, evaluationData.evaluationassignment[i].username);
                }
                return 1;
            }
            const returnValue = await processData();
        }
        catch (ex) {
            console.log("Error in updating data for Evaluation : " + ex);
            return { "updateCount": -1, "error": "Error in updating evaluation data" };
        }
        return { "updateCount": 1, "success": "Data updated successfully" };


    }
}

async function updateAnswersForEvaluation(answersToUpdate, username) {
    var updateCount = await answersToUpdate.forEach(async function (answer) {
        var answerCode = answer.answercode;
        var uniqueIdQuery = { "answercode": answerCode };
        var setQuery = { $set: { "assignedto": username, "isassigned": "Y" } };
        var updateCount = await connectionService.updateDocument(uniqueIdQuery, setQuery, "answersCollection");
        return updateCount;
    });
    return updateCount;
}

//temporary function
async function clearData(examCode) {
    query = { "examcode": examCode };
    setQuery = { $set: { "evaluationassignment": [], totalcopiesassignedforevaluation: 0 } };
    var test = connectionService.updateDocument(query, setQuery, "examCollection");

}

async function copyAssignedCopiesToUserFolder(username, examcode, additionalCopies) {
    //var sourceDir = config.fileLocation + "scannedcopies" + config.filePathSeparator + examcode;
    var sourceDir = "/Users/potomac/Desktop/PM/DESFiles";
    var filesRead = await fs.readdir(sourceDir);
    var copiedFiles = 0 ;
    const fileProcess = async () => {
        for (var i = 0; i < filesRead.length; i++) {
            var destinationDir = "/Users/potomac/Desktop/PM/DESFiles/dest/" + username;//config.fileLocation + config.filePathSeparator + "evaluatedcopies" + config.filePathSeparator + examcode + config.filePathSeparator + username + config.filePathSeparator + "assigned" + config.filePathSeparator;
            console.log("copying files from : " + sourceDir + " TO --> " + destinationDir);
            

            if (copiedFiles == additionalCopies) {
                break ; 
            }
            var fileName = filesRead[i];
            var extension = fileName.substring(fileName.lastIndexOf(".") + 1);
            if (extension != "pdf") {
                continue;
            }
            const copyFiles = async () => {
                var sourceFileName = sourceDir + config.filePathSeparator + fileName;
                var destinationFileName = destinationDir + config.filePathSeparator + fileName;
                var filesCopied = await fs.move(sourceFileName, destinationFileName, { "overwrite": false });
                copiedFiles = copiedFiles + 1;
                return copiedFiles ; 
            }
            const returned = await copyFiles();
            
        }
        

        return 1;

    };

    const returnValue = await fileProcess();
    return returnValue;

}



async function saveQuestion(examDetails, questions, userid) {
    var uniqueIdQuery = { "examcode": examDetails.examcode }
    var updateCount = 0;

    var setQuery = {
        $set: { "questions": questions, "modifiedby": userid, "modifieddate": new Date() }
    };
    updateCount = await connectionService.updateDocument(uniqueIdQuery, setQuery, "examCollection");
    if (updateCount == 11000) {//its a duplicate error
        return { "updateCount": updateCount, "error": "This subject code already exist. Please try a different one." };
    }
}

