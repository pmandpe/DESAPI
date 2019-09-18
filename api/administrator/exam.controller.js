const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const config = require('config.json');
const examService = require('./exam.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/roles');

// routes
router.post('/get', authorize(Role.Admin), getExams);
router.post('/save', authorize(Role.Admin), saveExams);
router.post('/details', authorize(Role.Admin), getExamsDetails);
router.post('/scanningassignment/save', authorize(Role.Admin), saveScanningAssignment);
router.post('/evaluationassignment/save', authorize(Role.Admin), saveEvaluationAssignment);
router.post('/question/save', authorize(Role.Admin), saveQuestion);


module.exports = router;

async function getExams(req, res, next) {
    //var subjects = await lookupService.getAllSubjects() ;
    var exams = await examService.getAllExams();
    res.json(exams);
}


async function saveExams(req, res, next) {
    var username = req.username;
    var returValue = await examService.saveExam(req.body, username);
    res.json(returValue);
}


async function saveScanningAssignment(req, res, next) {
    var username = req.username;
    var returValue = await examService.saveScanningAssignment(req.body, username);
    res.json(returValue);
}

async function saveEvaluationAssignment(req, res, next) {
    var username = req.username;
    var returValue = await examService.saveEvaluationAssignment(req.body, username);
    res.json(returValue);
}


async function getExamsDetails(req, res, next) {
    var examdetails = await examService.getExamDetails(req.body.examcode);
    res.json(examdetails);
}


async function saveQuestion(req, res, next) {
    var examdetails = await examService.getExamDetails(req.body.examcode);
    var returnValue = await examService.saveQuestion(examdetails[0], req.body.questions, req.username) ;
    res.json(examdetails);
}

