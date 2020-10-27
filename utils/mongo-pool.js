const MongoClient = require('mongodb').MongoClient

// Note: A production application should not expose database credentials in plain text.
// For strategies on handling credentials, visit 12factor: https://12factor.net/config.
//const PROD_URI = "mongodb+srv://gneelesh:abcd1234@cluster0-wgyza.mongodb.net/admin?replicaSet=Cluster0-shard-0&connectTimeoutMS=10000&authSource=&authMechanism=SCRAM-SHA-1"
const PROD_URI = "mongodb://localhost:27017/desdb" ;
//const PROD_URI = "mongodb+srv://gneelesh:abcd1234@cluster0-wgyza.mongodb.net/admin?replicaSet=Cluster0-shard-0&connectTimeoutMS=10000";
//const MKTG_URI = "mongodb://<dbuser>:<dbpassword>@<host1>:<port1>,<host2>:<port2>/<dbname>?replicaSet=<replicaSetName>"



var option = {
    db: {
        numberOfRetries: 5
    },
    server: {
        auto_reconnect: true,
        useUnifiedTopology: true ,
        
        poolSize: 10,
        socketOptions: {
            connectTimeoutMS: 500
        }
    },
    replSet: {},
    mongos: {},
    useNewUrlParser: true
};

function MongoPool() { }

var p_db;

function initPool(cb) {
    MongoClient.connect(PROD_URI, option, function (err, db) {
        if (err) {
            console.log(err)
            throw err;
        }

        p_db = db;
        if (cb && typeof (cb) == 'function')
            cb(p_db);
    });
    return MongoPool;
}

MongoPool.initPool = initPool;

function getInstance(cb) {
    if (!p_db) {
        initPool(cb)
    }
    else {
        if (cb && typeof (cb) == 'function')
            cb(p_db);
    }
}
MongoPool.getInstance = getInstance;

module.exports = MongoPool;