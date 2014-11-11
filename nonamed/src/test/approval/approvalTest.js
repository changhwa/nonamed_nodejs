'use strict';

var superagent = require('superagent');
var expect = require('expect.js');

describe('전자결재', function() {
    it.skip('결재대기 목록을 조회한다.', function (done) {
        superagent.post('http://localhost:3000/approval/apprApprovalList')
            .send({
                loginUserCode: "money1@nonamed.io",
                listType: "wait",
                approverAppCd: "APWT"
            })
            .end(function (e, res) {
                if (res.error){
                    console.log("error: "+res.error.message);
                } else {
                    console.log(res.text);
                }
                done();
            })
    });

    it.skip('결재자가 결재를 열람/승인/보류한다.', function(done){
        var approverAppCd = "APRD",
            loginUserCode = "money1@nonamed.io",
            docUid = "a8655700-5df2-11e4-9cd0-f7a498a897da";

        superagent.post('http://localhost:3000/approval/doApproval')
            .send({
                approverAppCd: approverAppCd,
                loginUserCode: loginUserCode,
                docUid: docUid
            })
            .end(function(e, res){
                if (res.error){
                    console.log("error: "+res.error.message);
                } else {
                    console.log("success: "+res.text);
                }
                done();
            });
    });
});