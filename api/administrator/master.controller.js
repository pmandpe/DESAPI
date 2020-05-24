const express = require('express');
const router = express.Router();
const masterService = require('./master.service');
const lookupService = require('./lookup.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/roles');
// routes
// routes
router.post('/subject/save', authorize(Role.Admin), addSubjectMaster);
router.post('/subject/get', authorize(Role.Admin), getAllSubjects);
router.post('/subject/getdetails', authorize([Role.Admin]), getSubjectDetails);

router.post('/users/save', authorize([Role.Admin]), saveUser);
router.post('/users/save/admin', authorize([Role.SA]), saveUser);
 
router.post('/users/get', authorize([Role.Admin, Role.SA]), getUsers);
router.post('/users/getevaluators', authorize([Role.Admin, Role.SA]), getEvaluators);
router.post('/users/getadmins', authorize([Role.SA]), getAdmins);
router.post('/users/pendingevaluators', authorize([Role.SA]), getPendingEvaluators);
router.post('/users/getdetails', authorize([Role.Admin, Role.SA]), getUserDetails);
router.post('/users/approveusers', authorize(Role.SA), approveUsers);
router.post('/users/changepassword', authorize([Role.Evaluator, Role.Admin]), changePassword);

//router.get('/', getAll);

module.exports = router;

async function addSubjectMaster(req, res, next) {
    var user = await masterService.saveSubject(req.body);
    
    res.json(user) ;
}


async function getAllSubjects(req, res, next) {
    var subjects = await masterService.getAllSubjects();
    res.json(subjects) ;
}


async function getSubjectDetails(req, res, next) {
    var subjects = await masterService.getSubjectDetails(req.body.subjectcode);
    res.json(subjects) ;
}

function getUsers(req, res, next) {
    masterService.getUsers()
        .then(users => res.json(users))
        .catch(err => next(err));
}


function getEvaluators(req, res, next) {
    lookupService.getAllUsers(Role.Evaluator)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getAdmins(req, res, next) {
    lookupService.getAllUsers(Role.Admin)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getPendingEvaluators(req, res, next) {
    masterService.getPendingEvaluators()
        .then(users => res.json(users))
        .catch(err => next(err));
}

async function saveUser(req, res, next) {
    var user = await masterService.saveUser(req.body);
    res.json(user) ;
}


async function getUserDetails(req, res, next) {
    var user = await masterService.getUserDetails(req.body.username);
    res.json(user) ;
}

async function approveUsers(req, res, next) {
    var updateStatus = await masterService.approveUsers(req.body);
    res.json(updateStatus) ;
}


async function changePassword(req, res, next){
    let username = req.username ; 
    let currentPwd = req.body.current_pwd ; 
    let newPwd = req.body.pwd ;
    let returnValue = await masterService.changePassword(username, currentPwd, newPwd) ;4
    res.send(returnValue) ;
}
