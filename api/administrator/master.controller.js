const express = require('express');
const router = express.Router();
const masterService = require('./master.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/roles');
// routes
// routes
router.post('/subject/save', authorize(Role.Admin), addSubjectMaster);
router.post('/subject/get', authorize(Role.Admin), getAllSubjects);
router.post('/subject/getdetails', authorize(Role.Admin), getSubjectDetails);
router.get('/', getAll);

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

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}
