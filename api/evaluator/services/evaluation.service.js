const config = require('config.json');

var connectionService = require('utils/connection.service')
var Q = require('q');


module.exports = {
    getEvaluationData
};

async function getEvaluationData(username, examcode) {

    var query = {
        "examcode": examcode
    };

    var examDetails = await connectionService.getDocuments(query, "examCollection");

    var markingDetails = examDetails[0].evaluationassignment.find(x=> x.username == username)
    return markingDetails;
}

