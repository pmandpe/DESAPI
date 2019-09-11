
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const config = require('config.json');
var formidable = require('formidable');
var util = require('util');
var express = require('express');
var fs = require('fs');
var app = express();
const router = express.Router();

const dashboardService = require('./dashboard.service')
const authorize = require('_helpers/authorize')
const Role = require('_helpers/roles');

// routes
router.post('/dashboard', authorize(Role.Scanner), getDashboardData);

module.exports = router;

async function getDashboardData(req, res, next) {
    //var subjects = await lookupService.getAllSubjects() ;
    var username = req.username;
    var dashboard = await dashboardService.getDashboard(username);
    res.json(dashboard);
}

async function uploadScannedDocument(req, res, next) {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        fs.readFile(files.RemoteFile.path, function (err, data) {
            // save file from temp dir to new dir
            var newPath = __dirname + "/UploadedImages/" + fields['filename'];
            fs.writeFile(newPath, data, function (err) {
                if (err) throw err;
                console.log('file saved');
                res.end();
            });
        });
    });

}