/**
 * exportsObj object만 router에서 사용이 가능하다.
 */

var APPROVAL_LINE = {},
    exportsObj = {};

/**
 * 결재자 결재코드
 *  none: 결재못함(현재 결재대상이 아니다),
 *  wait: 대기(현재 결재대상이다),
 *  done: 결재완료,
 *  read: 열람(현재 결재대상이다),
 *  withhold: 보류(현재 결재대상이다),
 *  reject: 반려
 */
APPROVAL_LINE.approverAppCd = {
    none: "APNN",
    wait: "APWT",
    done: "APDN",
    read: "APRD",
    withhold: "APWH",
    reject: "APRJ"
};

/**
 * 결재대기 결재코드목록
 */
APPROVAL_LINE.waitApproverAppCdList = [
    APPROVAL_LINE.approverAppCd.wait,
    APPROVAL_LINE.approverAppCd.read,
    APPROVAL_LINE.approverAppCd.withhold
];

/**
 * 결재코드값이 결재대기 결재코드목록인지 확인
 *
 * @param approverAppCd
 * @returns {boolean}
 */
APPROVAL_LINE.isWaitApproverAppCdList = function(approverAppCd){
    var waitApproverAppCdList = APPROVAL_LINE.waitApproverAppCdList;
    for (var i in waitApproverAppCdList){
        if (waitApproverAppCdList[i] == approverAppCd){
            return true;
        }
    }
    return false;
};

var APPROVAL_LIST_TYPE = {
    wait: "wait",
    ongoing: "ongoing",
    finish: "finish"
};

exportsObj = {
    APPROVAL_LINE: APPROVAL_LINE,
    APPROVAL_LIST_TYPE: APPROVAL_LIST_TYPE
};

(function(exports){
    exports.obj = exportsObj;
})(typeof exports === 'undefined'? this['apprNs']={}: exports);