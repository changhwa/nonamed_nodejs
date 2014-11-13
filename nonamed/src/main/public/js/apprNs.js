/**
 * exportsObj object만 router에서 사용이 가능하다.
 */

var APPROVAL_LINE = {},
    DRAFT_DOCUMENT = {},
    APPROVAL_LIST_TYPE = {},
    APPROVAL_COMMON = {},
    exportsObj = {};

/**
 * 유통에 따른 문서구분
 *  ordinaryDoc: 내부결재문서
 *  internalDoc: 대내문서
 *  externalDoc: 대외문서
 *  receiveSendSameDoc: 수신자와 발신자 명의같은 문서
 */
DRAFT_DOCUMENT.distributionType = {
    ordinaryDoc: 'ORDDOC',
    internalDoc: 'INTDOC',
    externalDoc: 'EXTDOC',
    receiveSendSameDoc: 'RSSDOC'
};

/**
 * 결재공통코드(DraftDocument.docStatus, ApprovalLine.approverAppCd)
 *  none: 결재못함(현재 결재대상이 아니다)
 *  finish: 완료
 *  approving
 *      value: 결재중
 *      wait: 대기
 *      read: 열람
 *      withhold: 보류
 *      done: 승인
 *  discard: 폐기
 *  reject: 반려
 *  withdraw: 회수
 *  writing: 작성중
 */
//TODO: private로 변경
APPROVAL_COMMON.approvalCode = {
    none: 'APNN',
    finish: 'APFN',
    approving: {
        value: 'APIG',
        wait: 'APWT',
        read: 'APRD',
        withhold: 'APWH',
        done: 'APDN'
    },
    discard: 'APDC',
    reject: 'APRJ',
    withdraw: 'APWD',
    writing: 'APWR'
};

APPROVAL_COMMON.approvalCodeName = {
    none: 'APNN',
    finish: 'APFN',
    approving: {
        value: 'APIG',
        wait: 'APWT',
        read: 'APRD',
        withhold: 'APWH',
        done: 'APDN'
    },
    discard: 'APDC',
    reject: 'APRJ',
    withdraw: 'APWD',
    writing: 'APWR'
};

/**
 * 결재자 결재코드로 문서상태 값을 가져온다
 * TODO: param 재정의 필요
 *
 * 결재자 결재코드에 없는 문서상태값
 *  finish: 완료
 *  approving: 결재중
 *  discard: 폐기
 */
DRAFT_DOCUMENT.getDocStatus = function(approverAppCd, isLastApprover, isDiscard){
    var finish = APPROVAL_COMMON.approvalCode.finish,
        approving = APPROVAL_COMMON.approvalCode.approving.value,
        discard = APPROVAL_COMMON.approvalCode.discard,
        result = approverAppCd;

    if (('undefined' != isLastApprover) && (true == isLastApprover)){
        result = finish;
    }

    var approvingCdList = [
        APPROVAL_COMMON.approvalCode.approving.wait,
        APPROVAL_COMMON.approvalCode.approving.read,
        APPROVAL_COMMON.approvalCode.approving.withhold,
        APPROVAL_COMMON.approvalCode.approving.done
    ];

    if ('undefined' != approverAppCd){
        for (var i in approvingCdList){
            if (approvingCdList[i] == approverAppCd){
                result = approving;
            }
        }
    }

    if (('undefined' != isDiscard) && (true == isDiscard)){
        result = discard;
    }

    return result;
};

/**
 * 결재자 결재코드
 */
APPROVAL_LINE.approverAppCd = {
    none: APPROVAL_COMMON.approvalCode.none,
    wait: APPROVAL_COMMON.approvalCode.approving.wait,
    done: APPROVAL_COMMON.approvalCode.approving.done,
    read: APPROVAL_COMMON.approvalCode.approving.read,
    withhold: APPROVAL_COMMON.approvalCode.approving.withhold,
    reject: APPROVAL_COMMON.approvalCode.reject,
    withdraw: APPROVAL_COMMON.approvalCode.withdraw,
    writing: APPROVAL_COMMON.approvalCode.writing
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

APPROVAL_LIST_TYPE = {
    wait: "wait",
    ongoing: "ongoing",
    finish: "finish"
};

exportsObj = {
    APPROVAL_LINE: APPROVAL_LINE,
    APPROVAL_LIST_TYPE: APPROVAL_LIST_TYPE,
    DRAFT_DOCUMENT: DRAFT_DOCUMENT
};

(function(exports){
    exports.obj = exportsObj;
})(typeof exports === 'undefined'? this['apprNs']={}: exports);