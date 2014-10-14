var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('organization/org_tree', { title: 'Express' });
});

router.get('/tree', function(req,res){
    console.log(req);
    model.Department.findAll({
        where: { parent_dept_code: req.query.deptCode }
    }).success(function(dept) {
        res.send(dept);
    });
});
module.exports = router;
