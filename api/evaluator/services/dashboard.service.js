const config = require('config.json');

var connectionService = require('utils/connection.service')
var Q = require('q');


module.exports = {
    getDashboard
};

async function getDashboard(username) {
    var query =  { 
        "evaluationassignment.username" : username
    }
    var scannerDashboard = await connectionService.getDocuments(query, "examCollection");
    return scannerDashboard ;
}


async function uploadScannedDocument(scannedData, username, rollNumber, scannedQR) {
   console.log("Uploading") ;
}
