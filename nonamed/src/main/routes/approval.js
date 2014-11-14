var express = require('express'),
    router = express.Router(),
    model = require('../model'),
    apprNs = require('../public/js/apprNs.js');

Sequelize = require('sequelize');
apprNs = apprNs.obj;

/**
 * 결재대상: approvalLine.whoApproval: 'ME'
 *
 *
 * 결재대기목록 조회
 *  find:
 *      approvalLine.approverEmail: loginUserId,
 *      approvalLine.whoApproval: 'ME',
 *      approvalLine.rejectTarget: user,
 *      approvalLine.agentTarget: user
 *
 * 기안 (결재선 저장)
 *  save:
 *      기안자:
 *          approvalLine.approverAppCd: 'draftWait',
 *          approvalLine.whoApproval: 'ME'
 *      결재자:
 *          approvalLine.approverAppCd: 'none',
 *          approvalLine.whoApproval: null
 *
 *
 * 결재처리 및 다음 결재자 선택
 * (현재 결재할 사용자의 uid 검색)
 *
 *  find: 결재문서의 모든 결재선 조회
 *      condition:
 *          //approvalLine.whoApproval: 'ME',
 *          //approvalLine.approverEmail: loginUserId,
 *          approvalLine.docUid: docUid
 *
 * 처리에 필요한 결재자 데이터:
 *  현재 결재자의 데이터,
 *  다음 결재자의 데이터,
 *  반려대상자의 데이터(기안자),
 *  직무대리자인 경우
 * 처리:
 *  arrayList에서 approvalList.whoApproval: 'ME' 가 있는 데이터 추출
 *  그 다음 index의 데이터 추출, 없는 경우 ''
 *
 *
 * (추후 결재선에 부서종류 컬럼필요(기안부서, 접수부서, 감사부서))
 * draftDocument.docStatus: save, update 필요 (기안자 정보필요)
 *
 *  update: 반려
 *      approvalLine.approverAppCd: 'reject',
 *      approvalLine.whoApproval: null,
 *      approvalLine.approverPrcDate: new Date()
 *      condition:
 *          approvalLine.approvalLineUid(현재 결재자)
 *
 *  update: 반려
 *      approvalLine.whoApproval: 'ME',
 *      condition:
 *          approvalLine.approvalLineUid(반려 대상자)
 *
 *  update: 승인/보류
 *      case '기안자':
 *          approvalLine.approverAppCd: 'draftDone',
 *          approvalLine.whoApproval: null,
 *          approvalLine.approverPrcDate: new Date()
 *          condition:
 *              approvalLine.approvalLineUid(현재 결재자)
 *      case '결재자':
 *          approvalLine.approverAppCd: 'done',
 *          (approvalLine.approverAppCd: 'withhold')
 *          approvalLine.whoApproval: null,
 *          approvalLine.approverPrcDate: new Date()
 *          condition:
 *              approvalLine.approvalLineUid(현재 결재자)
 *      case '직무대리자':
 *          save: 직무대리자의 데이터 (부재자정보 수정)
 *          update:
 *              부재자의 approverAppCd, whoApproval, approverPrcDate,
 *              부재자 이후 결재자는 approverOrder
 *
 *
 *  update: 결재대상 지정
 *      case '반려했을 경우':
 *          approvalLine.whoApproval: 'ME'
 *          condition:
 *              approvalLine.approvalLineUid(반려 대상자)
 *      case '다음 결재자가 있는 경우':
 *              if '다음 결재자가 부재자인 경우'
 *                  case '결재대기':
 *                      break;
 *                  case '결재안함':
 *                      최종결재자인 경우: 대기
 *                      중간결재자인 경우: 패스 > 부재결재처리
 *                  case '직무대리자':
 *                      break;
 *              else '아닌경우(다음 결재자가 결재자인 경우)'
 *                  approvalLine.approverAppCd: 'notRead',
 *                  approvalLine.whoApproval: 'ME'
 *                  condition:
 *                      approvalLine.approvalLineUid(다음 결재자)
 *      case '다음 결재자가 없는 경우':
 *          break;
 *

 *
 * update: 회수/작성중(임시저장)
 *      approvalLine.approverAppCd: 'withdraw',
 *      (approvalLine.approverAppCd: 'writing')
 *      approvalLine.approverPrcDate: new Date()
 *      condition:
 *          approvalLine.approvalLineUid(현재 결재자)
 *
 * update: 폐기 (이력관리에 대해 고민)
 *      approvalLine.whoApproval: null
 *      condition:
 *          approvalLine.approvalLineUid(현재 결재자)
 *      update:
 *          draftDocument.docStatus: 'discard'
 *
 * update: 열람(열람여부는 client 에서 결재선정보로 확인)
 *      approvalLine.approverAppCd: 'read',
 *      approvalLine.approverPrcDate: new Date()
 *      condition:
 *          approvalLine.approvalLineUid(현재 결재자)
 *
 * update: 문서책임자(=결재권자, 접수자)(approvalLine.whoDocAuthority)
 *      기안시 결재선등록시 전결권자, 결재권자를 지정한다. (옵션에 따라 추가/삭제가능)
 *      접수시 접수자를 지정한다.
 *      문서내 결재선에 날짜를 표시한다.
 *      발신명의에 표시된다.
 *
 * 문서권한부서란 기본적으로 기안부서이며, 타부서로 설정할 수 있다.
 *
 * update: 문서채번
 *      문서권한부서 draftDocument.docAuthorityDept 에서 실시
 *
 * save: 기록물철에 등록
 *      문서권한부서 draftDocument.docAuthorityDept 에서 실시
 *
 *
 * 생산등록번호 등록시기(2013년도기록물관리지침.hwp, http://www.archives.go.kr/next/manager/recodeRegister.do)
 *  결재권자가 결재 또는 보고종료시 또는 반려즉시
 *  반려문서를 재기안할 경우 반려문서가 첨부형태로 관리되는경우는 반려즉시에 부여하지 않을 수 있음
 *
 *  반려문서
 *      반려문서 재기안시 원문서를 첨부
 *      반려문서 기록물철 저장 - 문서채번
 *      반려문서 폐기
 *
 *  참고:
 *      대결자가 최종결재했을경우 대결자 결재선에 날짜가 출력된다
 *      발신명의는 결재권자의 명의와 서명(사무관리실무편람FAQ.hwp)
 *
 */

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

            res.send({
                msg: "create success",
                draftDocumentJson: draftDocumentArr[0].dataValues
            });
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