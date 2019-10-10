const config = require('config.json');
var formidable = require('formidable');
var fs = require('fs-extra');
var dbr = require('dynamsoft-javascript-barcode');
var QrCode = require('qrcode-reader');
var Jimp = require("jimp");
const PDF2Pic = require("pdf2pic");
var connectionService = require('utils/connection.service')
var examService = require("../../administrator/exam.service")
var utils = require("utils/utilities.service")
var Q = require('q');


module.exports = {
    getUserScanningSummary,
    uploadDocument
};


async function getUserScanningSummary(username, examcode) {
    var examDetails = await examService.getExamDetails(examcode);
    var scanningAssignments = [];
    if (examDetails && examDetails.length > 0) {
        scanningAssignments = examDetails[0].scanningassignment;
    }

    var userScanningSummary = {};
    scanningAssignments.forEach(function (scanningSummary) {
        if (scanningSummary.username == username) {
            userScanningSummary = scanningSummary;
        }
    }) ;
    userScanningSummary.scannedcopies = (userScanningSummary.scannedcopies ? userScanningSummary.scannedcopies : 0 ) ;
    return userScanningSummary;
}


async function uploadDocument(req) {

    var form = new formidable.IncomingForm();
    var username = req.username;
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
    var fields = parsedItems[0];
    var files = parsedItems[1];
    //convert the uploaded file to PDF. This is used only for Virtual scanner purpose
    var barcode = await getBarcode(fields, files, username, fields.examcode);

    //get the barcode from image
     return barcode ;
}

async function getBarcode(fields, files, username, examcode) {

    var data = await fs.readFile(files.RemoteFile.path);
    var answerCode = "ANS-" + utils.generateUniqueCode();
    var dirPath = config.fileLocation + "scannedcopies" + config.filePathSeparator + examcode + config.filePathSeparator;
    var pdfFilePath = dirPath + answerCode + ".pdf";

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath); // make the parent directory
        fs.mkdirSync(dirPath + config.filePathSeparator + "images"); // keep all the assigned scanned copies here
        //fs.mkdirSync(dir + "\\evaluated"); // keep all the evaluated copies here.
    }
    // save file from temp dir to new dir
   
    //-- convert pdf to image file because barcode/qrcode cant be read directly from pdf file.
    var returnValue = await fs.writeFile(pdfFilePath, data);
    //var converToImage = await convertPdfToImage(answerCode, dirPath, filePath);

    //--read barcode from converted image
    var barcode = await readBarcode(answerCode, dirPath, pdfFilePath)
    
    //var session = await connectionService.getSession() ; 
    
    try {
       //var transact =  session.sessionObject.startTransaction( { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } } );
       var answerUpdateCount = await addAnswer(fields, username, barcode, pdfFilePath, answerCode);
       console.log("Answer Added : " + answerUpdateCount) ;
       if (answerUpdateCount > 0){
            var updateScanningNumberCount = await updateScanningNumbers(fields.examcode, username) ;
            if (updateScanningNumberCount >0) {
                return "Y" ;
            }
            else{
                //-- delete the recently added answer since the transaction is not complete
            }
       }
    
        return "N" ;

      } catch (err) {
        console.log("Error in updating answers : " + err) ;
        return "N" ;
      }
      finally{
          //session.sesssio.endSession() ; 
      }


    return barcode ;
}

async function addAnswer(fields, username, qrcode, pdfFilePath, answerCode) {
    var addAnswerData = {};
    addAnswerData.answercode = answerCode ; 
    addAnswerData.examcode = fields.examcode;
    addAnswerData.scandate = new Date();
    addAnswerData.scannedby = username;
    addAnswerData.answers = [];
    addAnswerData.isassigned = "N";
    addAnswerData.pdfFilepath = pdfFilePath;
    addAnswerData.qrcode = qrcode;

    var uniqueIdQuery = {answercode: answerCode} ;
    var setQuery = {$set: addAnswerData} ;
    //console.log(JSON.stringify(addAnswerData));
    updateCount = await connectionService.upsertDocument(uniqueIdQuery, setQuery, "answersCollection");
    if (updateCount == 11000) {//its a duplicate error
        return { "updateCount": updateCount, "error": "This subject code already exist. Please try a different one." };
    }
    return updateCount ; 

}


async function updateScanningNumbers(examcode, username){
    var columnList = {
        "scanningassignment": 1,
    }
    var examDetails = await examService.getExamDetails(examcode) ;
    var scanningAssignment = examDetails[0].scanningassignment.filter(function(assignment) {
        return assignment.username == username;
    });
    var assignedCopies = scanningAssignment[0].assignedcopies ; 
    var scannedCopiesSoFar = ( scanningAssignment[0].scannedcopies ? scanningAssignment[0].scannedcopies : 0); 

    

    var whereClause = { "examcode" : examcode, "scanningassignment.username": username } ;
    var setQuery = { 
        "$set": { 
            "scanningassignment.$.scannedcopies": (scannedCopiesSoFar + 1),
            "scanningassignment.$.assignedcopies": (assignedCopies - 1), 
            "totalscannedcopies": ((examDetails[0].totalscannedcopies ? examDetails[0].totalscannedcopies : 0) + 1) 
        }
    }
    var updateCount = await connectionService.updateDocument(whereClause, setQuery, "examCollection") ;
    
}

async function convertPdfToImage(answerCode, dirPath, filePath) {
    var saveDirectory = dirPath + "images" + config.filePathSeparator;
    const pdf2pic = new PDF2Pic({
        density: 100,           // output pixels per inch
        savename: answerCode,   // output file name
        savedir: saveDirectory,    // output file location
        format: "png",          // output file format
        size: "600x600"         // output size in pixels
    });
    var imageFile = saveDirectory + answerCode + "_1.png";
    var returnValue = await pdf2pic.convertBulk(filePath, -1).then((resolve) => {
        return resolve;
    });

    //var returnValue = await scanBarcode(imageFile);
    return true ;    
}

async function readBarcode(answerCode, dirPath, filePath, imageFile) {
    var imageFile =  dirPath + "images" + config.filePathSeparator + answerCode + "_1.png";
    var convertToPdf =await  convertPdfToImage(answerCode, dirPath, filePath) ;
    var buffer = fs.readFileSync(imageFile);
    var image = await Jimp.read(buffer) ;
    var qr = new QrCode();
    var qrCode = await qr.decode(image.bitmap) ;
    /*
    
        dbr.BarcodeReader.productKeys = 't0068MgAAADeAlfybFb2TJdV0WSDWAZ8nxgW9KBwKuS9fkJkzensrOvXITNLfmViRjGABv2zQ9JDA6n8Qg5CI2ybecMlGqRg=';
        dbr.BarcodeReader.createInstance().then(reader => {
        reader.decode(config.fileLocation + "\\images\\test.png").then(results => {
            for(var i = 0; i < results.length; ++i){
                console.log(results[i].BarcodeText);
            }
            reader.destroy();
        });
    });
    */

    return qr.result.result ;
}
