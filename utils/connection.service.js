var config = require('config.json') ;
var mongodb = require('mongodb') ;
var service = {} ;
var Q = require('q') ;

service.getConnection = getConnection ; 
service.getDocuments = getDocuments ;
service.addDocuments = addDocuments ;
service.upsertDocument = upsertDocument ; 
service.updateDocument = updateDocument ; 

module.exports = service

async function getConnection(){

    let url = 'mongodb://'
    var deferred = Q.defer() ; 
    if (config.auth_user){
        url = url + config.db_user + ':' + config.pwd + '@' ;

    }

    
    //const uri = "mongodb+srv://"+config.db_user+":"+config.pwd+"@cluster0-wgyza.mongodb.net/test?retryWrites=true&w=majority";
    const uri = "mongodb+srv://gneelesh:abcd1234@cluster0-wgyza.mongodb.net/admin?replicaSet=Cluster0-shard-0&connectTimeoutMS=10000&authSource=&authMechanism=SCRAM-SHA-1" ; 


    mongodb.MongoClient.connect(uri,  { useNewUrlParser: true }, function(err, database){
        if (err){
            deferred.reject(err.name + ':' + err.message) ;
        }

        global.db_connections.push({"appServer":"mongo", "appServerAddress": "mongodb","appDB":config.database, "connection" : database}) ;
        deferred.resolve(database) ;

        if (database && global.db_connections.length > 0){
            database.on('close' , () => {
                if (closeConnection(database)){
                    console.log('Connection is  closed' ) ;
                }
            }) ;
            database.on('error' , () => {
                if (closeConnection(database)){
                    console.log('Connection is  closed' ) ;
                }
            }) ;
            database.on('timeout' , () => {
                if (closeConnection(database)){
                    console.log('Connection is  closed' ) ;
                }
            }) ;

        }

    })

    return deferred.promise ;
}

function closeConnection(db){
    try{
        var i = global.db_connections.findIndex(j => j.appDB == db.appDB) ;
        if (i >= 0 ){
            (global.db_connections).splice(i,1);
        }
        return 1 ; 
    }
    catch (err){
        console.log("Error in closing connections " + err) ;
    }
}


async function getDocuments(query, collectionName){
    var connectionObject = await this.getConnection() ;
    var collection = connectionObject.db(config.database).collection(collectionName) ;
    var docs = await collection.find(query).toArray() ;
    return docs ; 
        
        
}


async function addDocuments(query, collectionName){
    
    try{
        var connectionObject = await this.getConnection() ;
        var collection = connectionObject.db(config.database).collection(collectionName) ;
        var docs = await collection.insertOne(query) ;
        return 1 ; 
    }
    catch (err){
        console.log("Error occured in inserting : "+ err) ;
        return err.code ; 
    }
    return -1 ; 
        
        
}


async function upsertDocument(uniqueIdQuery, setQuery, collectionName){
    
    try{
        var connectionObject = await this.getConnection() ;
        var collection = connectionObject.db(config.database).collection(collectionName) ;
        var docs = await collection.updateOne(uniqueIdQuery, setQuery, {upsert:true}) ;
        return 1 ; 
    }
    catch (err){
        console.log("Error occured in inserting : "+ err) ;
        return err.code ; 
    }
    return -1 ; 
        
        
}

async function updateDocument(whereClause, setQuery, collectionName){
    
    try{
        var connectionObject = await this.getConnection() ;
        var collection = connectionObject.db(config.database).collection(collectionName) ;
        var docs = await collection.updateOne(whereClause, setQuery) ;
        return 1 ; 
    }
    catch (err){
        console.log("Error occured in inserting : "+ err) ;
        return err.code ; 
    }
    return -1 ; 
        
        
}