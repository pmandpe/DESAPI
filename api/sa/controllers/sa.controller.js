
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const config = require('config.json');
var formidable = require('formidable');
var util = require('util');
var express = require('express');
var fs = require('fs');
var app = express();
const router = express.Router();

const paperAllocationService = require('../services/paperallocation.service')


const authorize = require('_helpers/authorize')
const Role = require('_helpers/roles');

// routes

router.post('/paper/download', authorize(Role.SA), downloadPaper);
router.post('/paper/approve', authorize(Role.SA), approvePaper);

module.exports = router;

async function downloadPaper(req, res, next) {
    let username = req.body.username;
    let file = null;
    var examcode = req.body.examcode;
    if (examcode && examcode != "") {
        file = await paperAllocationService.getPaper(username, examcode);
    }

    res.download(file);
}

async function approvePaper(req, res, next){
    let username = req.body.username ; 
    let examcode = req.body.examcode ;
    let updateCount = await paperAllocationService.approvePaper(username, examcode) ;
    res.json({"updateCount" : updateCount}) ;
}


