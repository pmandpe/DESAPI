const express = require('express');
const router = express.Router();
const masterService = require('./master.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/roles');
// routes
// routes
router.post('/subject/add', authorize(Role.Admin), addSubjectMaster);
router.post('/subject/get', authorize(Role.Admin), getSubjects);
router.get('/', getAll);

module.exports = router;

async function addSubjectMaster(req, res, next) {
    var user = await masterService.addSubject(req.body);
    
    res.json(user) ;
}


async function getSubjects(req, res, next) {
    var subjects = await masterService.getSubjects();
    
    res.json(subjects) ;
}


function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}
