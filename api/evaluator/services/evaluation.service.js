const config = require('config.json');
var examService = require('../../administrator/exam.service')
const fs = require("fs-extra")
var connectionService = require('utils/connection.service')
var Q = require('q');


module.exports = {
    getQuestions,
    getMarkingDetails,
    getAnswersPdf,
    getEvaluationData
};

async function getEvaluationData(username, examcode) {

    var query = {
        "examcode": examcode
    };
    var examDetails = await connectionService.getDocuments(query, "examCollection");
    var markingDetails = examDetails[0].evaluationassignment.find(x => x.username == username)
    markingDetails.totalExamMarks = examDetails[0].totalexammarks ; 
    return markingDetails;
}

async function getMarkingDetails(username, examcode){
    var evaluationAssignment = await getEvaluationData(username, examcode) ;
    var answerData = await getAnswerData(username, examcode) ;
    return {"evaluationassignment" : evaluationAssignment, "answerdata": answerData} ;
}


async function getQuestions(username, examcode) {

    var examDetails = await examService.getExamDetails(examcode);
    if (examDetails && examDetails.length > 0) {
        return examDetails[0].questions;
    }
    return [];
}


async function getAnswersPdf(examcode, username, answercode) {
    //var filePath = "/Users/potomac/Desktop/PM/Backup/DES/pdfsample.pdf";
    //-- path is like <root>\evaluatedcopies\<examcode>\<username>\assigned\<answercode>.pdf
    var filePath = config.fileLocation + "evaluatedcopies" + config.filePathSeparator + examcode +  config.filePathSeparator + username + config.filePathSeparator + "assigned" +config.filePathSeparator +  answercode + ".pdf"  ;
    var fileData = await fs.readFile(filePath);
    return fileData;
}


async function getAnswerData(username, examcode) {

    var query = {
        "assignedto": username,
        "examcode": examcode 
    };
    var answerDetails = await connectionService.getDocuments(query, "answersCollection", {}, 1);
    return answerDetails;
}
