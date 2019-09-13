
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const config = require('config.json');
var formidable = require('formidable');
var util = require('util');
var express = require('express');
var fs = require('fs');
var app = express();
const router = express.Router();

const evaluationService = require('../services/evaluation.service')
const dashboardService = require('../services/dashboard.service')
const authorize = require('_helpers/authorize')
const Role = require('_helpers/roles');

// routes
router.post('/marking', authorize(Role.Evaluator), getEvaluationData);
router.post('/dashboard', authorize(Role.Evaluator), getDashboardData);
router.post('/answerspdf', authorize(Role.Evaluator), getAnswersPDF);

module.exports = router;


//-- for dashboard data of evaluator
async function getDashboardData(req, res, next) {
    //var subjects = await lookupService.getAllSubjects() ;
    var username = req.username;
    var dashboard = await dashboardService.getDashboard(username) ;
    res.json(dashboard);
}


async function getEvaluationData(req, res, next) {
    var username = req.username;
    var examCode = req.body.examcode ; 
    var marking = await evaluationService.getEvaluationData(username, examCode) ;

   

    res.json(marking);
}


async function getAnswersPDF(req, res, next){
    var filePath = "/Users/potomac/Desktop/PM/Backup/DES/pdfsample.pdf" ;
    fs.readFile(filePath, function(err, data){
        res.contentType('application/pdf') ;
        res.send(data);
    })
}





