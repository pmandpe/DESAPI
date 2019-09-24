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
    })
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
    var returnValue = await readWriteFile(fields, files, username, fields.examcode);
    return returnValue;
}

async function readWriteFile(fields, files, username, examcode) {

    var data = await fs.readFile(files.RemoteFile.path);
    var answerCode = "ANS-" + utils.generateUniqueCode();
    var dirPath = config.fileLocation + "scannedcopies" + config.filePathSeparator + examcode + config.filePathSeparator;
    var filePath = dirPath + answerCode + ".pdf";

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath); // make the parent directory
        fs.mkdirSync(dirPath + config.filePathSeparator + "images"); // keep all the assigned scanned copies here
        //fs.mkdirSync(dir + "\\evaluated"); // keep all the evaluated copies here.
    }
    // save file from temp dir to new dir
   

    var returnValue = await fs.writeFile(filePath, data);
    //var converToImage = await convertPdfToImage(answerCode, dirPath, filePath);
    var barcode = await getBarcode(answerCode, dirPath, filePath)
    //addAnswer(fields, username);
    return true;
}

async function addAnswer(fields, username) {
    var addAnswerData = {};
    addAnswerData.examcode = fields.examcode;
    addAnswerData.scandate = new Date();
    addAnswerData.scannedby = username;
    addAnswerData.answers = [];
    addAnswerData.isassigned = "";
    addAnswerData.filepath = "";
    addAnswerData.qrcode = "";
    console.log(JSON.stringify(addAnswerData));
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
        console.log("image converter successfully!");
        
        return resolve;
    });

    //var returnValue = await scanBarcode(imageFile);
    return true ;    
}

async function getBarcode(answerCode, dirPath, filePath, imageFile) {
    
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
