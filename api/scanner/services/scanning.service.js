const config = require('config.json');
var formidable = require('formidable');
var fs = require('fs-extra');
const PDF2Pic = require("pdf2pic");
var connectionService = require('utils/connection.service')
var examService = require("../../administrator/exam.service")
var Q = require('q');


module.exports = {
    getUserScanningSummary,
    uploadDocument
};


async function getUserScanningSummary(username, examcode){
    var examDetails = await examService.getExamDetails(examcode);
    var scanningAssignments = [] ;
    if (examDetails && examDetails.length > 0){
        scanningAssignments = examDetails[0].scanningassignment ;
    }
     
    var userScanningSummary = {} ;
    scanningAssignments.forEach(function(scanningSummary){
        if(scanningSummary.username == username){
            userScanningSummary = scanningSummary ;
        }
    })
    return userScanningSummary ;
}


async function uploadDocument(req){
    
    var form = new formidable.IncomingForm();
    var username = req.username ;
    var parsedItems = await new Promise(function (resolve, reject) {
        form.parse(req, function (err, fields, files) {
            if (err) {
                reject(err);
                return;
            }
            console.log("within form.parse method, subject field of fields object is: " + fields.subjects);
            resolve([fields, files]);
        }); // form.parse
    });
    var fields = parsedItems[0] ;
    var files = parsedItems[1] ;

    var returnValue = await readWriteFile(fields, files, username ) ;
    return returnValue ; 
}

async function readWriteFile(fields, files, username){
             
    var data = await fs.readFile(files.RemoteFile.path) ;
    // save file from temp dir to new dir
    var newPath = config.fileLocation + "/mypdf.pdf";
    var returnValue =  await  fs.writeFile(newPath, data) ;
    var converToImage = await convertPdfToImage() ; 
    //addAnswer(fields, username) ;
    return true ; 

}

async function addAnswer(fields, username) {
    var addAnswerData = {} ;
    addAnswerData.examcode = fields.examcode ; 
    addAnswerData.scandate = new Date()  ; 
    addAnswerData.scannedby = username ; 
    addAnswerData.answers = [] ; 
    addAnswerData.isassigned = "" ; 
    addAnswerData.filepath =  ""; 
    addAnswerData.qrcode = ""; 
    console.log(JSON.stringify(addAnswerData)) ;
}

async function convertPdfToImage(){
    
const pdf2pic = new PDF2Pic({
    density: 100,           // output pixels per inch
    savename: "untitled",   // output file name
    savedir: config.fileLocation + "/images/",    // output file location
    format: "png",          // output file format
    size: "600x600"         // output size in pixels
  });

  pdf2pic.convertBulk(config.fileLocation + "mypdf.pdf", -1).then((resolve) => {
    console.log("image converter successfully!");
    return resolve;
  });
}
