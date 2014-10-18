var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    // res.send('respond with a resource');
    res.render('approval/apprMain', { title: '전자결재 메인페이지' });
});

router.get('/apprWriteDraftDoc', function(req, res) {
    res.render('approval/apprWriteDraftDoc', { title: '기안문 작성 페이지' });
});


router.get('/apprApprovalLine', function(req, res) {
    res.render('approval/apprApprovalLine', { title: '결재선 페이지' });
});

router.get('/apprApprovalWaitList', function(req, res) {
    res.render('approval/apprApprovalWaitList', { title: '결재대기 목록 페이지' });
});

router.get('/apprApprovalDoneList', function(req, res) {
    res.render('approval/apprApprovalDoneList', { title: '결재완료 목록 페이지' });
});


module.exports = router;