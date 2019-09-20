const config = require('config.json');
var examService = require('../../administrator/exam.service')
const fs = require("fs-extra")
var connectionService = require('utils/connection.service')
var Q = require('q');


module.exports = {
    getEvaluationData,
    getAnswersPdf,
    getQuestions
};

async function getEvaluationData(username, examcode) {

    var query = {
        "examcode": examcode
    };
    var examDetails = await connectionService.getDocuments(query, "examCollection");
    var markingDetails = examDetails[0].evaluationassignment.find(x => x.username == username)
    return markingDetails;
}


async function getQuestions(username, examcode) {

    var examDetails = await examService.getExamDetails(examcode);
    if (examDetails && examDetails.length > 0) {
        return examDetails[0].questions;
    }
    return [];
}


async function getAnswersPdf(examcode, username) {
    var filePath = "/Users/potomac/Desktop/PM/Backup/DES/pdfsample.pdf";
    //var filePath = config.fileLocation +"/evaluatedcopies/" +examcode + "/" + username + "/assigned/" + fileName  ;
    var fileData = await fs.readFile(filePath);
    return fileData;
}
