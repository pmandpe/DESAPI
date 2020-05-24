require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
//var jwt = require('express-jwt');
let cookieParser = require('cookie-parser'); 
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
var db ; 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser()); 
app.use(cors());

// use JWT auth to secure the api   

//console.log("JWT " + JSON.stringify(test)) ;
/*app.use(jwt({
    secret: "LP1234",
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring (req) {
        console.log("Inside Get Token" + req.body.token);
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          
          return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    }
  })); 
*/
// api routes
app.use('/users', jwt(),  require('./users/users.controller'));

app.use('/api/v1/master', jwt(),  require('./api/administrator/master.controller'));
app.use('/api/v1/lookup', jwt(),  require('./api/administrator/lookup.controller'));
app.use('/api/v1/exams',    jwt(), require('./api/administrator/exam.controller'));
app.use('/api/v1/scanner', jwt(),   require('./api/scanner/controllers/scanner.controller'));
app.use('/api/v1/sa', jwt(),   require('./api/sa/controllers/sa.controller'));
app.use('/api/v1/evaluator',   jwt(), require('./api/evaluator/controllers/evaluation.controller'));


function getRoot(request, response) {
  response.sendFile(path.resolve('./www/index.html'));
}
app.use(express.static('./www'));

app.get('/', getRoot);



//app.use('/api/v1', (req, res) => res.send('Hello World!')) ;

// global error handler
app.use(errorHandler);
global.db_connections = [] ;
global.des_server = ''
// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
require("utils/mongo-pool").initPool();
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
