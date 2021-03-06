var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('organization/login');
});

/* GET users listing. */
router.post('/create',function(req,res){
    var user = model.User.build({
        code: req.body.code,
        passwd: req.body.passwd,
        name: req.body.name,
        auth_key: req.body.authKey,
        office: req.body.office,
        position: req.body.position,
        security_grade: req.body.securityGrade
    });
    user.save().then(function() {
        return model.Department.find(req.body.deptCode);
    }).then(function(dept){
        return model.DeptUser.build({
            user_code: req.body.code,
            department_code: dept.dataValues.code
        }).save();
    }).then(function(){
        res.send({msg: "회원가입에 성공하였습니다."});
    }).catch(function(e){
        console.log( " ERROR : " + e);
        res.send({msg: "회원가입에 실패하였습니다."});
    });
});

router.post('/move',function(req,res){
    model.DeptUser.find({ where: { user_code: req.body.source } })
        .then(function(_user) {
            _user.department_code = req.body.target;
            return _user.save();
        }).then (function(){
            res.send({msg: "조직도변경에 성공하였습니다."});
        }).catch(function(e){
            console.log(e);
            res.send({msg: "조직도변경에 실패하였습니다."});
        });
});

router.post('/login' ,function(req,res){
    model.User.find({   attributes : ['code','name','office','position','security_grade'],
                        where:{code:req.body.code, passwd: req.body.passwd},
                        include:[model.Department]})
        .then(function(_user){
            req.session.user = _user.dataValues;
            res.send({msg: "로그인에 성공하였습니다" , loginYn : true});
        }).catch(function(e){
            res.send({msg: "로그인에 실패하였습니다" , loginYn : false})
        });
});

module.exports = router;
