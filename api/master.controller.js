const express = require('express');
const router = express.Router();
const masterService = require('./master.service');

// routes
router.post('/subject/add',addSubjectMaster);
router.get('/', getAll);

module.exports = router;

async function addSubjectMaster(req, res, next) {
    var user = await masterService.addSubject(req.body);
    
    res.json(user) ;
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}
