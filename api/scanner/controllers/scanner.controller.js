
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const config = require('config.json');

var util = require('util');
var express = require('express');
var fs = require('fs');
var app = express();
var scanningService = require("../services/scanning.service") ;
const router = express.Router();

const dashboardService = require('../services/dashboard.service')
const authorize = require('_helpers/authorize')
const Role = require('_helpers/roles');

// routes
router.post('/dashboard', authorize(Role.Scanner), getDashboardData);
router.post('/summary', authorize(Role.Scanner), getUserScanningSummary); 
router.post('/uploadscan', authorize(Role.Scanner), uploadScannedDocument); 

module.exports = router;

async function getDashboardData(req, res, next) {
    //var subjects = await lookupService.getAllSubjects() ;
    var username = req.username;
    var dashboard = await dashboardService.getDashboard(username);
    res.json(dashboard);
}

async function uploadScannedDocument(req, res, next) {
    var returnValue = await scanningService.uploadDocument(req) ;
    res.end() ; 
    

}

async function getUserScanningSummary(req, res, next){
    var username = req.username ; 
    var examcode = req.body.examcode ;
    var userScanningSummary  = await scanningService.getUserScanningSummary(username, examcode) ;
    res.json(userScanningSummary);
}