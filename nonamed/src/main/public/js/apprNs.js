var APPROVAL_LINE = {},
    exportsObj = {};

/**
 * @type{{
 *  none: 결재못함(현재 결재대상이 아니다),
 *  wait: 결재대기(현재 결재대상이다),
 *  finish: 결재완료}}
 */
APPROVAL_LINE.approverAppCd = {
    none: "APNN",
    wait: "APWT",
    finish: "APFN"
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