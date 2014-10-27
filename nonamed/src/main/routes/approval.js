var express = require('express');
var router = express.Router();
var model = require('../model');

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
    var reqDraftDocument = model.DraftDocument.build({
        //docUid: req.body.docUid,
        subject: req.body.subject,
        contents: req.body.contents
    });

    reqDraftDocument
        .save()
        .success(function(){
            res.send({ msg: "create success" });
        })
        .error(function(errors){
            console.log(errors);
            res.send({ msg: "create fail" })
        });
});

router.get('/apprDraftDocument/read', function(req, res){
    var docUid = "56a9fd40-5df1-11e4-af09-3f0ff240fb97";

    model.DraftDocument.find({
        where: { docUid: docUid }

    }).success(function(draftDocument) {
        var draftDocumentJson = JSON.stringify(draftDocument);
        res.render(
            'approval/apprDraftDocument',
            {
                title: "문서조회",
                draftDocumentJson: draftDocumentJson,
                viewStatus: 'read'
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