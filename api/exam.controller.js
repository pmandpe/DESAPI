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
router.post('/details',getExamsDetails);

module.exports = router;

async function getExams(req, res, next) {
    //var subjects = await lookupService.getAllSubjects() ;
    var exams = await examService.getAllExams() ;
    res.json(exams) ;
}


async function saveExams(req, res, next) {
    var username = req.username ; 
    
    var returValue = await examService.saveExam(req.body, username) ;
    res.json(returValue) ;
}


async function getExamsDetails(req, res, next) {
    var examdetails = await examService.getExamDetails(req.body.examcode);
    
    res.json(examdetails) ;
}

