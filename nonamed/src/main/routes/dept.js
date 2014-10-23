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

router.post('/create',function(req,res){
    var dept = model.Department.build({
        code: 'D'+uuid.v1(),
        dept_name: req.body.deptName,
        parent_dept_code: req.body.parentDeptCode
    });
    dept.save().success(function(){
        // 성공메세지
        console.log("success");
    });
});

router.post('/move',function(req,res){

    model.Department.find(req.body.source)
        .success(function(_dept){
            _dept.parent_dept_code = req.body.target;
            _dept.save().success(function(){
                res.send({msg: "조직도변경에 성공하였습니다."});
            });
        });
});

module.exports = router;
