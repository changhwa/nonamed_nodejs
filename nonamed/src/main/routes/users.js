var express = require('express');
var router = express.Router();
var model = require('../model');

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
    user.save().success(function(){
        // 성공메세지
        console.info("success");
        model.Department.find(req.body.deptCode).success(function(dept){
            model.DeptUser.build({
                user_code: req.body.code,
                department_code: dept.dataValues.code
            }).save().success(function(){
                res.send({msg: "회원가입에 성공하였습니다."});
            })
        })
    });

});

router.post('/move',function(req,res){
    model.DeptUser.find({ where: { user_code: req.body.source } })
        .success(function(_user){
            _user.department_code = req.body.target;
            _user.save().success(function(){
                res.send({msg: "조직도변경에 성공하였습니다."});
            });
        });
});

module.exports = router;
