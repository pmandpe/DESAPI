const config = require('config.json');

var connectionService = require('utils/connection.service')
var Q = require('q');


module.exports = {
    getDashboard
};

async function getDashboard(username) {
    var query =  { 
        "scanningassignment.username" : username
    }
    var columnList = {"examname": 1, "scanningassignment.$": 1, "subjectcode":1, "examcode": 1} ;
    var scannerDashboard = await connectionService.getDocuments(query, "examCollection", columnList);
    return scannerDashboard ;
}


async function uploadScannedDocument(scannedData, username, rollNumber, scannedQR) {
   console.log("Uploading") ;
}
