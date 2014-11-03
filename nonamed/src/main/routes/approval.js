var express = require('express');
var router = express.Router();
var model = require('../model');
Sequelize = require('sequelize');

router.get('/', function(req, res) {
    res.render('approval/apprMain', { title: '전자결재' });
});

router.get('/apprDraftDocument', function(req, res) {
    res.render(
        'approval/apprDraftDocument',
        {
            title: '기안문 작성',
            viewStatus: 'create'
        }
    );
});

router.post('/apprDraftDocument/create', function(req, res){
    var draftDocumentJsonArr = JSON.parse(req.body.draftDocumentJson);
    var approvalLineJsonArr = JSON.parse(req.body.approvalLineJson);

    var approvalLineUidArr = [];
    for (var i in approvalLineJsonArr){
        approvalLineUidArr.push(approvalLineJsonArr[i].approvalLineUid);
    };

    var chainer = new Sequelize.Utils.QueryChainer();
    chainer
        .add(model.ApprovalLine.bulkCreate(approvalLineJsonArr))
        .add(model.DraftDocument.bulkCreate(draftDocumentJsonArr))
        .runSerially()
        //.run()
        .success(function(result) {
            var approvalLineArr = result[0];
            var draftDocumentArr = result[1];

            var approvalLineUidArr = [];
            for (var i in approvalLineArr){
                approvalLineUidArr.push(approvalLineArr[i].approvalLineUid);
            };

            draftDocumentArr[0].setApprovalLine(approvalLineUidArr);
            res.send({ msg: "create success" });
        })
        .error(function(errors) {
            if (0 < errors.length){
                for (var i in errors){
                    console.log(">>>>> "+ errors[i].parent.message);
                }
            } else {
                console.log(">>>>> "+errors);
            }
            res.send({ msg: "error" });
        });
});

router.post('/apprDraftDocument/read', function(req, res){
    var docUid = req.body.selectedDocUid;
    var resultObj = {};

    model.DraftDocument.find({
        where: {docUid: docUid}

    }).then(function(_draftDocument){
        resultObj.draftDocument = _draftDocument;
        return _draftDocument;

    }).then(function(_draftDocument){
        return _draftDocument.getApprovalLine();

    }).then(function(_approvalLine) {
        resultObj.approvalLine = _approvalLine;
        return resultObj;

    }).then(function(resultObj){
        res.render(
            'approval/apprDraftDocument',
            {
                draftDocumentJson: JSON.stringify(resultObj.draftDocument),
                approvalLineJson : JSON.stringify(resultObj.approvalLine)
            }
        );
    });
});

router.post('/apprDraftDocument/update', function(req, res){
    var reqDraftDocument = model.DraftDocument.build({
        docUid: req.body.docUid,
        subject: req.body.subject,
        contents: req.body.contents
    });

    model.DraftDocument.find({
        where: { docUid: reqDraftDocument.docUid }

    }).success(function(draftDocument) {
        draftDocument
            .updateAttributes({
                subject: reqDraftDocument.subject,
                contents: reqDraftDocument.contents
            })
            .success(function() {
                var draftDocumentJson = JSON.stringify(draftDocument);
                res.send({
                    msg: "update success",
                    draftDocumentJson: draftDocumentJson
                });
            });
    });
});

router.post('/apprDraftDocument/delete', function(req, res){
    var reqDraftDocument = model.DraftDocument.build({
        docUid: req.body.docUid
    });

    model.DraftDocument.find({
        where: { docUid: reqDraftDocument.docUid }

    }).success(function(draftDocument){
        draftDocument
            .destroy()
            .success(function(){
                res.send({ msg: "delete success" });
            });
    });
});

router.get('/apprApprovalList', function(req, res){
    var reqDraftDocument = model.DraftDocument.build({
        // 조건
    });

    model.DraftDocument.findAll().success(function(draftDocuments) {
        var draftDocumentsJson = JSON.stringify(draftDocuments)
        res.render(
            "approval/apprApprovalList",
            {
                title: "결재목록",
                draftDocumentsJson: draftDocumentsJson
            }
        )
    });
});

module.exports = router;