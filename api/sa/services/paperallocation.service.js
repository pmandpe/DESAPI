const config = require('config.json');
var connectionService = require('utils/connection.service')
var Q = require('q');
var path = require("path");
module.exports = {
    getPaper,
    approvePaper
};

async function getPaper(username, examcode){
    fileName = await getFileName(username, examcode) ;
    var uploadFilePath = config.fileLocation + "uploadpapers" + config.filePathSeparator;
    let file = path.resolve(uploadFilePath + fileName);
    return file ;
}


async function getFileName(username, examcode){
    let query = {} ;
    if (username == ""){
        //if user name is not passed, it means we want admin to download approved paper 
        query = { "examcode": examcode, "paperallocation.approved": "Y" } ;
    }
    else{
        query = { "examcode": examcode, "paperallocation.username": username } ;
    }
        
    let columnList =  {"paperallocation.upload_location.$":1} ;

    
    var exam = await connectionService.getDocuments(query, "examCollection", columnList);
    if (exam && exam.length > 0 && exam[0].paperallocation && exam[0].paperallocation.length > 0 && exam[0].paperallocation[0].upload_location){
        return exam[0].paperallocation[0].upload_location ; 
    }
    return "" ; 


}

async function approvePaper(username, examcode){
    try{
        let query = { "examcode":examcode, "paperallocation.username": username } ;
        let setQuery = {$set: {"paperallocation.$.approved": "Y"}} ;
        let updateCount = await connectionService.updateDocument(query, setQuery, "examCollection") ;
    
        return updateCount ;
    
    }
    catch(ex){
        console.log("Error in approving ------ "+ ex) ;
        return -1 ;
    }
}