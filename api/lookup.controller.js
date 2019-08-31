const express = require('express');
const router = express.Router();
const lookupService = require('./lookup.service');

// routes
router.post('/subjects',getAllSubjects);
router.post('/scanners',getAllScanners);


module.exports = router;

async function getAllSubjects(req, res, next) {
    var subjects = await lookupService.getAllSubjects() ;
    res.json(subjects) ;
}


async function getAllScanners(req, res, next) {
    var scanners = await lookupService.getAllScanners() ;
    res.json(scanners) ;
}
