
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
router.post('/marking', authorize(Role.Evaluator), getAnswersMarking);
router.post('/marking/save', authorize(Role.Evaluator), saveAnswers);
router.post('/dashboard', authorize(Role.Evaluator), getDashboardData);
router.post('/answerspdf', authorize(Role.Evaluator), getAnswersPdf);
router.post('/questions', authorize(Role.Evaluator), getQuestions);
router.post('/evaluationdata', authorize(Role.Evaluator), getEvaluationData);
router.post('/evaluationsummary', authorize(Role.Evaluator), getAnswerSummaryForUser);

module.exports = router;



//-- for dashboard data of evaluator
async function getDashboardData(req, res, next) {
    //var subjects = await lookupService.getAllSubjects() ;
    var username = req.username;
    var dashboard = await dashboardService.getDashboard(username) ;
    res.json(dashboard);
}


async function getAnswersMarking(req, res, next) {
    var username = req.username;
    var examCode = req.body.examcode ; 
    var answerCode = req.body.answercode
    var marking = await evaluationService.getMarkingDetails(username, examCode, answerCode) ;
    res.json(marking);
}


async function getAnswersPdf(req, res, next){
    var username = req.username;
    var examCode = req.body.examcode ; 
    var answerCode = req.body.answercode ;
    //, {"examcode":examcode, "answercode": answercode}
    var data = await evaluationService.getAnswersPdf(examCode, username, answerCode) ;
    res.contentType('application/pdf') ;
    //res.json(data)  ;
    res.send(data);
    
}


async function getQuestions(req, res, next) {
    var username = req.username;
    var examCode = req.body.examcode ; 
    var answerCode = req.body.answercode ;
    var questions = await evaluationService.getQuestions(username, examCode) ;
    var answers = await evaluationService.getMarkingDetails(username, examCode, answerCode) ;

   var returnValue = {"questions": questions, "answers": answers } ;

    res.json(returnValue);
}


async function getEvaluationData(req, res, next) {
    var username = req.username;
    var examCode = req.body.examcode ; 
    var questions = await evaluationService.getEvaluationData(username, examCode) ;
    res.json(questions);
}

async function getAnswerSummaryForUser(req, res, next) {
    var username = req.username;
    var examCode = req.body.examcode ; 
    var questions = await evaluationService.getPendingAndEvaluatedAnswers(examCode, username) ;
    res.json(questions);
}


async function saveAnswers(req, res, next) {
    var username = req.username;
    var answerData = req.body.answerData; 
    var questions = await evaluationService.saveAnswers(answerData, username) ;
    var saveExamDetails = await evaluationService.updateEvaluationNumbers(username, answerData.examcode, answerData.answercode) ; 
    res.json(questions);
}


