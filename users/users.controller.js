const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/roles');
// routes
router.post('/authenticate', authenticate);

router.get('/', getAll);

module.exports = router;

async function authenticate(req, res, next) {
    var user = await userService.authenticate(req.body);
    if (user && user.token){
        res.cookie('jwtexpress', user.token) ;
        //res.json(user) ;
        res.send(user); 
    }
    else{
        res.json({"status":400, "message": "Invalid Userid / Password"}) ;
    }
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}
