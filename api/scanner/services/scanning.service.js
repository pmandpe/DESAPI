const config = require('config.json');
var formidable = require('formidable');
var desResponse = require('../../../model/des.response')
var Constants = require('../../../_helpers/constants')
var fs = require('fs-extra');
var dbr = require('dynamsoft-javascript-barcode');
var QrCode = require('qrcode-reader');
var hummus = require('hummus') ;
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

    
    try{
        var form = new formidable.IncomingForm();
        var username = req.username;
        var parsedItems = await new Promise(function (resolve, reject) {
            form.parse(req, function (err, fields, files) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve([fields, files]);
            }); 
        });
        var fields = parsedItems[0];
        var files = parsedItems[1];
        var dirPath = config.fileLocation + "scannedcopies" + config.filePathSeparator + fields.examcode + config.filePathSeparator;
        //-- Create the directory for storing scanned PDF if it doesnot exist.
        console.log("File Uploaded to " + dirPath) ;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath); // make the parent directory
            fs.mkdirSync(dirPath + config.filePathSeparator + config.firstPageLocation) ;
        }

        var answerCode = "ANS-" + utils.generateUniqueCode();
        //-- This is only for Virtual Scanner
        var data = await fs.readFile(files.RemoteFile.path);
        var pdfFilePath = dirPath + answerCode + config.answerFileExtension ;


        await fs.writeFile(pdfFilePath, data);
        //fs.close() ; 

        //-- sepaarate the first page of pdf from rest of pdf
        var firstPagePath = await separateFirstPage(dirPath, pdfFilePath, answerCode) ;
        if (firstPagePath != null ){
            returnValue = await updateAnswers(fields, files, username,  pdfFilePath, firstPagePath, answerCode)  ;
            return {"code": Constants.SUCCESS_CODE, "message": "Data updated successfully."} ;
            
        }
        else{
            return {"code": Constants.FAIULRE_CODE, "message": "Only 0 or 1 page in scanned answer sheet. Upload failed."} ;
        }
    }
    catch (ex){
        return {"code": Constants.FAIULRE_CODE, "message": "Error in uploading document." + ex} ;
        return -1 ; 
    }
}

async function separateFirstPage(dirPath, pdfFilePath, answerCode){
    try{
        var pdfReader = hummus.createReader(pdfFilePath) ;
        var pageCount = pdfReader.getPagesCount() ;
        if (pageCount < 1){
            console.log("There are no pages available in PDF.") ;
            return null ; 
        }

        if (pageCount == 1){ //No pages available to be separated.
            console.log("Only one page is available in answer " + answerCode) ;
            return null ; 
        }
        var firstPagePdf = dirPath + config.firstPageLocation + config.filePathSeparator + answerCode + config.answerFileExtension  ;
        var pdfWriter = hummus.createWriter(firstPagePdf) ;
        //-- put first page in a folder of "firstpage"
        pdfWriter.createPDFCopyingContext(pdfReader).appendPDFPageFromPDF(0) ;
        pdfWriter.end() ; 
        pdfWriter = hummus.createWriter(dirPath + answerCode + config.evaluatorextension + config.answerFileExtension) ; 
        if (pageCount > 1){
            
            
            for(var i=1;i< pageCount ;++i){
                pdfWriter.createPDFCopyingContext(pdfReader).appendPDFPageFromPDF(i);
            }
        }
        else{
            console.log("Total Pages for Answer : " + answerCode + " Were only one. No further pages available, only first page was scanned.") ;
            firstPagePdf = null ; 
        }
        pdfWriter.end();
        return firstPagePdf ;
    //--put remaining PDF in separate PDF
    }
    catch(ex){
        console.log("Error in creating files " + new Date() + ex ) ;
        return null ;
    }

}

async function updateAnswers(fields, files, username, pdfFilePath, firstPagePath, answerCode) {
    try {
       //var transact =  session.sessionObject.startTransaction( { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } } );
       var answerUpdateCount = await addAnswer(fields, username, pdfFilePath, firstPagePath,  answerCode);
       
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
     
}   

async function addAnswer(fields, username, pdfFilePath, firstPagePath, answerCode) {
    var addAnswerData = {};
    
    addAnswerData.answercode = answerCode ; 
    addAnswerData.rollnumber = fields.rollnumber;
    addAnswerData.numberofsupplimentaries = fields.numberofsupplimentaries ; 
    addAnswerData.examcode = fields.examcode;
    addAnswerData.scandate = new Date();
    addAnswerData.scannedby = username;
    addAnswerData.answers = [];
    addAnswerData.isassigned = "N";
    addAnswerData.pdfFilepath = pdfFilePath;
    addAnswerData.firstpagepath = firstPagePath,
    addAnswerData.qrcode = "" ;//qrcode;

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
