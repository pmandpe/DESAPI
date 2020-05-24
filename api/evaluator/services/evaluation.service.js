const config = require('config.json');
var examService = require('../../administrator/exam.service')
const formidable = require('formidable')
const fs = require("fs-extra")
var connectionService = require('utils/connection.service')
var Q = require('q');


module.exports = {
    getQuestions,
    getMarkingDetails,
    getAnswersPdf,
    getEvaluationData,
    saveAnswers,
    updateEvaluationNumbers,
    getPendingAndEvaluatedAnswers,
    getPaperAllocation,
    uploadPaper
};

async function getEvaluationData(username, examcode) {

    var query = {
        "examcode": examcode
    };
    var examDetails = await connectionService.getDocuments(query, "examCollection");
    var markingDetails = examDetails[0].evaluationassignment.find(x => x.username == username)
    markingDetails.totalExamMarks = examDetails[0].totalexammarks;
    return markingDetails;
}

async function getMarkingDetails(username, examcode, answerCode) {

    var evaluationAssignment = await getEvaluationData(username, examcode);
    var answerData = await getAnswerData(username, examcode, answerCode);
    return { "evaluationassignment": evaluationAssignment, "answerdata": answerData };

}


async function getQuestions(username, examcode) {
    var returnValue = {};
    var examDetails = await examService.getExamDetails(examcode);
    returnValue.totalmarks = examDetails[0].totalmarks;
    if (examDetails && examDetails.length > 0) {
        returnValue.questions = examDetails[0].questions;
    }
    return returnValue;
}


async function getAnswersPdf(examcode, username, answercode) {
    //var filePath = "/Users/potomac/Desktop/PM/Backup/DES/pdfsample.pdf";
    //-- path is like <root>\evaluatedcopies\<examcode>\<username>\assigned\<answercode>.pdf
    var filePath = config.fileLocation + "evaluatedcopies" + config.filePathSeparator + examcode + config.filePathSeparator + username + config.filePathSeparator + "assigned" + config.filePathSeparator + answercode + config.evaluatorextension + config.answerFileExtension;
    //var filePath = "E:\\Projects\\DES\\DESFiles\\evaluatedcopies\\MAC-KLQH-30J1-MKVU\\shree\\assigned\\ANS-E0HT-LV1K-0XY5.pdf" ;
    var fileData = await fs.readFile(filePath);
    return fileData;
}


async function getAnswerData(username, examcode, answerCode) {
    var answerDetails = {};
    var query = {
        "assignedto": username,
        "examcode": examcode,
        $or: [{
            "isevaluated": {
                "$exists": false
            }
        },
        {
            "isevaluated": "N"
        }
        ]
    };
    if (answerCode == "") { // For random copy checking get just one answer which is not yet evaluated
        answerDetails = await connectionService.getDocuments(query, "answersCollection", {}, 1);
    }
    else {
        query = { "answercode": answerCode };
        answerDetails = await connectionService.getDocuments(query, "answersCollection", {}, 1);
    }
    return answerDetails;

}




async function saveAnswers(answerData, userid) {
    var uniqueIdQuery = { "examcode": answerData.examcode, "answercode": answerData.answercode }
    var updateCount = 0;

    var setQuery = {
        $set: { "answers": answerData.answers, "modifiedby": userid, "modifieddate": new Date(), "isevaluated": answerData.isevaluated }
    };
    updateCount = await connectionService.updateDocument(uniqueIdQuery, setQuery, "answersCollection");
    if (updateCount == 11000) {//its a duplicate error
        return { "updateCount": updateCount, "error": "Duplicate Record Error." };
    }
}


async function updateEvaluationNumbers(username, examCode, answerCode) {
    try {
        var examDetails = await examService.getExamDetails(examCode, { "evaluationassignment": 1 });
        var evaluationAssignment = examDetails[0].evaluationassignment.filter(function (assignment) {
            return assignment.username == username;
        });
        var assignedCopies = evaluationAssignment[0].assignedcopies;
        var evaluatedCopiesSoFar = (evaluationAssignment[0].evaluatedcopies ? evaluationAssignment[0].evaluatedcopies : 0);
        var whereClause = { "examcode": examCode, "evaluationassignment.username": username };
        var setQuery = {
            "$set": {
                "evaluationassignment.$.evaluatedcopies": (evaluatedCopiesSoFar + 1),
                "evaluationassignment.$.pendingforchecking": (assignedCopies - 1),
                "evaluationassignment.$.updatedate": new Date(),
                "totalevaluatedcopies": ((examDetails[0].totalevaluatedcopies ? examDetails[0].totalevaluatedcopies : 0) + 1)
            }
        }
        var updateCount = await connectionService.updateDocument(whereClause, setQuery, "examCollection");
        if (updateCount != 1) {
            return { "updateCount": updateCount, "error": "Error in updating numbers." };
        }

        //-- once everything is done, move the copies to evaluated folder
        var destinationPath = config.fileLocation + "evaluatedcopies" + config.filePathSeparator + examCode + config.filePathSeparator + username + config.filePathSeparator + "evaluated" + config.filePathSeparator + answerCode + config.answerFileExtension;
        var sourcePath = config.fileLocation + "evaluatedcopies" + config.filePathSeparator + examCode + config.filePathSeparator + username + config.filePathSeparator + "assigned" + config.filePathSeparator + answerCode + config.answerFileExtension;

        var filesCopied = await fs.move(sourcePath, destinationPath);
        return 1;
    }
    catch (Ex) {
        return { "updateCount": -1, "error": "Error in updating evaluation data." + Ex };
    }
}

async function getPendingAndEvaluatedAnswers(examCode, username) {

    var queryForEvaluated = {
        "assignedto": username,
        "examcode": examCode,
        "isevaluated": "Y"
    };
    var queryForPending = {
        "assignedto": username,
        "examcode": examCode,
        $or: [{
            "isevaluated": {
                "$exists": false
            }
        },
        {
            "isevaluated": "N"
        }
        ]
    };
    var evaluatedAnswers = await connectionService.getDocuments(queryForEvaluated, "answersCollection", { "answercode": 1, "_id": 0 });
    var pendingAnswers = await connectionService.getDocuments(queryForPending, "answersCollection", { "answercode": 1, "_id": 0 });
    return { "evaluatedcopies": evaluatedAnswers, "pendingcopies": pendingAnswers };
}



async function getPaperAllocation(username) {
    var queryForPaperAllocation = {
        "paperallocation.username": username
    };
    var paperAllocation = await connectionService.getDocuments(queryForPaperAllocation, "examCollection", { "examcode": 1, "examname": 1, "examdate": 1, "subjectcode": 1, "paperallocation.targetdate": 1, "_id": 0 });
    return paperAllocation
}


async function uploadPaper(req) {

    try {
        var form = new formidable.IncomingForm();
        var uploadFilePath = config.fileLocation + "uploadpapers" + config.filePathSeparator;
        var parsedItems = await new Promise(function (resolve, reject) {
            form.parse(req, function (err, fields, files) {
                if (err) {
                    reject(err);
                    return;
                }
                if (files) {
                    if (!fs.existsSync(uploadFilePath)) {
                        fs.mkdirSync(uploadFilePath); // make the  directory
                    }
                }

                resolve([fields, files]);
            });
        });
        var fields = parsedItems[0];
        var files = parsedItems[1];
        var data = await fs.readFile(files.files.path);

        var returnValue = await fs.writeFile(uploadFilePath + req.username + "-" + files.files.name, data);
        var formData = JSON.parse(fields.formParams) ;
        formData["username"] = req.username ; 
        updateCount = await updatePaperUpload(formData) ;
        if (updateCount < 0){
            return { "updateCount": -1, "message": "Upload of Question Paper Failed" };    
        }
        return { "updateCount": 1, "message": "File Uploaded Successfully" };
    }
    catch (exception) {
        return { "updateCount": -1, "message": "Upload of Question Paper Failed " +exception };
    }
  
}

async function updatePaperUpload(formData){
    var uniqueIdQuery = { "examcode": formData.examcode, "paperallocation.username": formData.username } ;

    var setQuery = {
        $set: {
            "paperallocation.$.upload_location": formData.username + "-" +formData.uploadpaper, 
            "paperallocation.$.status":"U", 
            "paperallocation.$.uploaded_date": new Date(),  
            "paperallocation.$.comments" : formData.uploadpapercomments
        }
    };
    updateCount = await connectionService.updateDocument(uniqueIdQuery, setQuery, "examCollection");
    return updateCount ; 
}