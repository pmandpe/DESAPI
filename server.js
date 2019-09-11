require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api   
//app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/api/v1/master', require('./api/master.controller'));
app.use('/api/v1/lookup', require('./api/lookup.controller'));
app.use('/api/v1/exams', require('./api/exam.controller'));
app.use('/api/v1/scanner', require('./api/scanner/dashboard/dashboard.controller'));


//app.use('/api/v1', (req, res) => res.send('Hello World!')) ;

// global error handler
app.use(errorHandler);
global.db_connections = [] ;
global.des_server = ''
// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
