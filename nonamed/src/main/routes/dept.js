var express = require('express');
var router = express.Router();
var model = require('../model');
var uuid = require('node-uuid');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('organization/org_tree', { mode: 'view' });
});

router.get('/tree', function(req,res){
    var organTree = {};
    model.Department.findAll({
        where: { parent_dept_code: req.query.deptCode }, order: 'code'
    }).then(function(dept) {
        organTree.dept = dept;
        return model.Department.find((req.query.deptCode == 0) ? 1 : req.query.deptCode);
    }).then(function(result) {
        return result.getUsers();
    }).then(function(user){
        organTree.user = user;
        res.send(organTree);
    });
});

router.get('/breadcrumbs', function(req,res){
    model.Department.find(req.query.deptCode).then(function(dept){
        if(dept != null){
            var path = dept.dataValues.path;
            var pathArr = path.split('/');
            return model.Department.findAll({ where : {code : pathArr}, order: 'level'})
        }
    }).then(function(_deptAll){
        res.send(_deptAll);
    })
});

router.post('/create',function(req,res){
    model.Department.find(req.body.parentDeptCode).then(function(dept){
        var code = 'D'+uuid.v1();
        return model.Department.build({
            code: code,
            dept_name: req.body.deptName,
            parent_dept_code: req.body.parentDeptCode,
            path: dept.dataValues.path+code+"/",
            level: dept.dataValues.level+1
        }).save();
    }).then(function(){
        res.send({msg: "부서를 추가하였습니다."});
    }).catch(function(e){
        console.log(" ERROR : " + e);
        res.send({msg: "실패하였습니다"});
    });
});

router.post('/move',function(req,res){

    var path = "";

    model.Department.find(req.body.target)
        .then(function(_parentDept){
            path = _parentDept.dataValues.path;
            return model.Department.find(req.body.source);
        }).then(function(_dept){
            _dept.parent_dept_code = req.body.target;
            _dept.path = path + _dept.code + "/";
            return _dept.save();
        }).then(function(){
            res.send({msg: "조직도변경에 성공하였습니다."});
        }).catch(function(){
            res.send({msg: "조직도변경에 실패하였습니다."});
        });
});

module.exports = router;
