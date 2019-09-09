const express = require('express');
const router = express.Router();
const lookupService = require('./lookup.service');

// routes
router.post('/subjects',getAllSubjects);
router.post('/users',getAllUsers);


module.exports = router;

async function getAllSubjects(req, res, next) {
    var subjects = await lookupService.getAllSubjects() ;
    res.json(subjects) ;
}


async function getAllUsers(req, res, next) {
    var users = await lookupService.getAllUsers(req.body.usertype) ;
    res.json(users) ;
}
