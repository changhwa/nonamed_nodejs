var express = require('express'),
    router = express.Router(),
    model = require('../model'),
    apprNs = require('../public/js/apprNs.js');

Sequelize = require('sequelize');
apprNs = apprNs.obj;

router.get('/', function(req, res) {
    res.render('approval/apprMain', { title: '전자결재' });
});

/**
 * 결재처리(열람, 승인, 보류)
 */
router.post('/doApproval', function(req, res) {
    var approverAppCd = req.body.approverAppCd,
        loginUserCode = req.body.loginUserCode,
        docUid = req.body.docUid;

    //TODO: 필수값 검증필요

    model.ApprovalLine.find({
        where: {
            /*
             * TODO: 조건변경
             *  1. 삭제 approverEmail (이유: 결재선에 동일인이 2명이상 있을경우 오류발생)
             *  2. 추가 approverAppCd (이유: 결재대기 결재코드목록인 경우에만 처리, 전제조건은 결재대기에서만 결재처리를 행한다.)
             */
            approverEmail: loginUserCode,
            docUid: docUid
        }
    }).then(function(_approvalLine){
        _approvalLine.updateAttributes({
            approverAppCd: approverAppCd,
            approverPrcDate: new Date()
        });
        return _approvalLine;
    }).then(function(_result){
        if (_result.error){
            res.send({msg: "error"});
        } else {
            res.send({msg: "success"});
        }
    });
});

router.get('/apprDraftDocument', function(req, res) {
    res.render('approval/apprDraftDocument',{
            title: '기안문 작성',
            viewStatus: 'create'
        }
    );
});

router.post('/apprDraftDocument/create', function(req, res){
    var draftDocumentJsonArr = JSON.parse(req.body.draftDocumentJson),
        approvalLineJsonArr = JSON.parse(req.body.approvalLineJson),
        approvalLineUidArr = [],
        chainer = new Sequelize.Utils.QueryChainer();

    for (var i in approvalLineJsonArr){
        approvalLineUidArr.push(approvalLineJsonArr[i].approvalLineUid);
    }

    chainer
        .add(model.ApprovalLine.bulkCreate(approvalLineJsonArr))
        .add(model.DraftDocument.bulkCreate(draftDocumentJsonArr))
        .runSerially()
        //.run()
        .success(function(result) {
            var approvalLineArr = result[0],
                draftDocumentArr = result[1],
                approvalLineUidArr = [];

            for (var i in approvalLineArr){
                approvalLineUidArr.push(approvalLineArr[i].approvalLineUid);
            }
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
            res.send({msg: "error"});
        });
});

router.post('/apprDraftDocument/read', function(req, res){
    var docUid = req.body.selectedDocUid,
        resultObj = {};

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
        res.render('approval/apprDraftDocument',{
                draftDocumentJson: JSON.stringify(resultObj.draftDocument),
                approvalLineJson: JSON.stringify(resultObj.approvalLine),
                viewStatus: req.body.viewStatus
            }
        );
    });
});

/**
 * 결재문서 수정
 */
router.post('/apprDraftDocument/update', function(req, res){
    var reqDraftDocument = model.DraftDocument.build({
        docUid: req.body.docUid,
        subject: req.body.subject,
        contents: req.body.contents
    });

    model.DraftDocument.find({
        where: {docUid: reqDraftDocument.docUid}
    }).success(function(draftDocument) {
        draftDocument
            .updateAttributes({
                subject: reqDraftDocument.subject,
                contents: reqDraftDocument.contents
            })
            .success(function(){
                var draftDocumentJson = JSON.stringify(draftDocument);
                res.send({
                    msg: "update success",
                    draftDocumentJson: draftDocumentJson
                });
            });
    });
});

/**
 * 결재문서 삭제
 */
router.post('/apprDraftDocument/delete', function(req, res){
    model.DraftDocument.find({
        where: {docUid: req.body.docUid}
    }).success(function(draftDocument){
        draftDocument
            .destroy()
            .success(function(){
                res.send({msg: "delete success"});
            });
    });
});

/**
 * 결재문서 목록 조회
 */
router.post('/apprApprovalList', function(req, res){
    var listType = req.body.listType,
        approverEmail = req.body.loginUserCode,
        approverAppCd = req.body.approverAppCd,
        conditionObj = {};

    if (-1 < approverAppCd.indexOf(',')){
        approverAppCd = approverAppCd.split(',');
    }

    switch (listType){
        case (apprNs.APPROVAL_LIST_TYPE.wait):
            conditionObj = {
                approverEmail: approverEmail,
                approverAppCd: approverAppCd
            };
            break;
        case (apprNs.APPROVAL_LIST_TYPE.ongoing):
            conditionObj = "";
            break;
        default:
            conditionObj = "";
            break;
    }

    model.ApprovalLine.findAll({
        where: conditionObj,
        include: [{
            model: model.DraftDocument,
            required: true
        }]
    }).then(function(_waitList){
        var draftDocuments = [],
            approvalLines = [];

        for (var i in _waitList){
            draftDocuments.push(_waitList[i].DraftDocument.dataValues);
            approvalLines.push(_waitList[i].dataValues);
        }

        return {
            draftDocuments: draftDocuments,
            approvalLines: approvalLines
        };
    }).then(function (_data){
        res.render("approval/apprApprovalList", {
                title: listType + " List",
                listType: listType,
                draftDocumentsJson: JSON.stringify(_data.draftDocuments),
                approvalLineJson: JSON.stringify(_data.approvalLines)
            }
        )
    });
});

module.exports = router;