var config = require('config.json');
var mongodb = require('mongodb');
var service = {};
var Q = require('q');
var MongoPool = require("utils/mongo-pool");

service.getConnection = getConnection;
service.getDocuments = getDocuments;
service.addDocuments = addDocuments;
service.upsertDocument = upsertDocument;
service.updateDocument = updateDocument;
service.getSession = getSession;
service.upsertDocumentInTransaction = upsertDocumentInTransaction ;

module.exports = service

async function getConnection() {
    var deferred = Q.defer();
    /*
    let url = 'mongodb://'
    var deferred = Q.defer();
    if (config.auth_user) {
        url = url + config.db_user + ':' + config.pwd + '@';

    }


    //const uri = "mongodb+srv://"+config.db_user+":"+config.pwd+"@cluster0-wgyza.mongodb.net/test?retryWrites=true&w=majority";
    const uri = "mongodb+srv://gneelesh:abcd1234@cluster0-wgyza.mongodb.net/admin?replicaSet=Cluster0-shard-0&connectTimeoutMS=10000&authSource=&authMechanism=SCRAM-SHA-1" ; 
    //const uri = "mongodb://localhost:27017";


    mongodb.MongoClient.connect(uri, { useNewUrlParser: true, poolSize:10 }, function (err, database) {
        if (err) {
            deferred.reject(err.name + ':' + err.message);
        }

        global.db_connections.push({ "appServer": "mongo", "appServerAddress": "mongodb", "appDB": config.database, "connection": database });
        deferred.resolve(database);
    })

    return deferred.promise;
    */
    MongoPool.getInstance(function (db){
        deferred.resolve(db);
    });
    return deferred.promise;
}

function closeConnection(connectionObject) {
    var db = connectionObject.appDB(config.database);
    try {
        var i = global.db_connections.findIndex(j => j.appDB == db.appDB);
        if (i >= 0) {
            (global.db_connections).splice(i, 1);
        }
        return 1;
    }
    catch (err) {
        console.log("Error in closing connections " + err);
    }
}


async function getDocuments(query, collectionName, columnList, limit) {
    var connectionObject;
    try {
        if (!limit) {
            limit = 0 ;
        }
        connectionObject = await this.getConnection();
        var collection = connectionObject.db(config.database).collection(collectionName);
        var docs = await collection.find(query, columnList).limit(limit).toArray();
        return docs;
    }
    catch (err) {
        console.log("Error in connecting database : " + err)
    }
    finally {
        //closeConnection(connectionObject);
    }
    return null;

}


async function addDocuments(query, collectionName) {
    var connectionObject;
    try {
        connectionObject = await this.getConnection();
        var collection = connectionObject.db(config.database).collection(collectionName);
        var docs = await collection.insertOne(query);
        return 1;
    }
    catch (err) {
        console.log("Error occured in inserting : " + err);
        return err.code;
    }
    finally {
        //this.closeConnection(connectionObject);
    }
    return -1;


}


async function upsertDocument(uniqueIdQuery, setQuery, collectionName) {
    var connectionObject;
    try {
        connectionObject = await this.getConnection();
        var collection = connectionObject.db(config.database).collection(collectionName);
        var upsertValue = await collection.updateOne(uniqueIdQuery, setQuery, { upsert: true });
        
        return upsertValue.upsertedCount ; 
    }
    catch (err) {
        console.log("Error occured in inserting : " + err);
    }

    return -1;

}

async function updateDocument(whereClause, setQuery, collectionName) {
    var connectionObject;
    try {
        connectionObject = await this.getConnection();
        var collection = connectionObject.db(config.database).collection(collectionName);
        var docs = await collection.updateOne(whereClause, setQuery);
        return 1;
    }
    catch (err) {
        console.log("Error occured in inserting : " + err);
        return err.code;
    }
    finally {
       // this.closeConnection(connectionObject);
    }
    return -1;


}

async function getSession(){
    var connectionObject = await this.getConnection() ;
    const session = connectionObject.startSession( { readPreference: { mode: "primary" } } );; 
    return {"sessionObject": session, "connectionObject": connectionObject} ; 
}



async function updateDocumentInSession(whereClause, setQuery, collectionName, session) {
    var connectionObject;
    try {
        connectionObject = await this.getConnection();
        var collection = connectionObject.db(config.database).collection(collectionName);
        var docs = await collection.updateOne(whereClause, setQuery, {session}); 
        return 1;
    }
    catch (err) {
        console.log("Error occured in inserting : " + err);
        return err.code;
    }
    finally {
       // this.closeConnection(connectionObject);
    }
    return -1;


}



async function upsertDocumentInTransaction(uniqueIdQuery, setQuery, collectionName, session) {
    var connectionObject;
    try {
        connectionObject = session.connectionObject ; 
        var sessionObject = session.sessionObject ; 
        var database = session.connectionObject.db(config.database) ;
        var collection = database.collection(collectionName);
        var docs = await collection.updateOne(uniqueIdQuery, setQuery, { upsert: true }, {session: session.sessionObject}); 
        return 1;
    }
    catch (err) {
        console.log("Error occured in inserting : " + err);
        return err.code;
    }
    finally {
        //this.closeConnection(connectionObject);
    }
    return -1;


}