'use strict';

var superagent = require('superagent'),
    expect = require('expect.js'),
    apprNs = require('../../main/public/js/apprNs.js');

apprNs = apprNs.obj;

var fnResult = function(e, res, done){
    if (res.error) {
        console.log("error: " + res.error.message);
    } else {
        console.log(res.text);
    }
    done();
};

describe('전자결재', function(){
    it.skip('결재대기 목록을 조회한다.', function(done){
        var loginUserCode = 'money1@nonamed.io',
            listType = apprNs.APPROVAL_LIST_TYPE.wait,
            approverAppCd = apprNs.APPROVAL_LINE.waitApproverAppCdList;

        superagent.post('http://localhost:3000/approval/apprApprovalList')
            .send({
                loginUserCode: loginUserCode,
                listType: listType,
                approverAppCd: approverAppCd
            })
            .end(function (e, res){
                fnResult(e, res, done);
            })
    });

    it.skip('결재자가 결재를 열람/승인/보류/반려한다.', function(done){
        var loginUserCode = 'money1@nonamed.io',
            approverAppCd = apprNs.APPROVAL_LINE.approverAppCd.read,
//            approverAppCd = apprNs.APPROVAL_LINE.approverAppCd.done,
//            approverAppCd = apprNs.APPROVAL_LINE.approverAppCd.withhold,
//            approverAppCd = apprNs.APPROVAL_LINE.approverAppCd.reject,
            docUid = 'a8655700-5df2-11e4-9cd0-f7a498a897da';

        superagent.post('http://localhost:3000/approval/doApproval')
            .send({
                approverAppCd: approverAppCd,
                loginUserCode: loginUserCode,
                docUid: docUid
            })
            .end(function(e, res){
                fnResult(e, res, done);
            });
    });
});