var express = require('express');
var router = express.Router();
var model = require('../model');
var uuid = require('node-uuid');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('organization/org_tree', { title: 'Express' });
});

router.get('/tree', function(req,res){
    var organTree = {};
    model.Department.findAll({
        where: { parent_dept_code: req.query.deptCode }
    }).success(function(dept) {
        organTree.dept =dept ;
        model.Department.find((req.query.deptCode==0) ? 1 : req.query.deptCode).success(function(result){
            result.getUsers().success(function(user){
                organTree.user = user;
                res.send(organTree);
            });

        });
    });
});
module.exports = router;
