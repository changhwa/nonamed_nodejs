var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res) {
    model.User.find({
        where: { email: 'test1@nonamed.co.kr' }
    }).success(function(user) {
        console.log(user);
    });
    res.render('index', { title: 'Express' });
});

module.exports = router;
