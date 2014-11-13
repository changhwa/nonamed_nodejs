BASE_APPROVAL_URL="/approval/";
BASE_DRAFT_DOCUMENT_URL="/approval/apprDraftDocument/";

$(document).ready(function(){
    $("#btnHistoryBack").click(function(event){
        event.preventDefault();
        history.back();
    });

    $('#loginUserCode').val("money1@nonamed.io"); //temp

    initOnClickEvent();
    initBtn();
    getDraftDocumentInfo();
    readDraftDocument();
});

/**
 * onclick 이벤트 초기화
 */
function initOnClickEvent(){
    $("#btnDoDraft").click(function(){doDraft();});
    $("#btnUpdateDraft").click(function(){updateDraft();});
    $("#btnDeleteDraft").click(function(){deleteDraft();});
    $("#btnSetApprovalLine").click(function(){displayApprovalLine();});
    $("#btnApprovalDone").click(function(){(manageApproval(APPROVAL_LINE.approverAppCd.done));});
    $("#btnApprovalWithhold").click(function(){manageApproval(APPROVAL_LINE.approverAppCd.withhold);});
    $("#btnApprovalReject").click(function(){manageApproval(APPROVAL_LINE.approverAppCd.reject);});
}

/**
 * 버튼 초기화
 */
function initBtn(){
    switch($("#viewStatus").val()){
        case "create":
            displayElement($("#btnDoDraft"), "show");
            displayElement($("#btnSetApprovalLine"), "show");
            break;
        case "read":
            displayElement($("#btnApprovalDone"), "show");
            displayElement($("#btnApprovalWithhold"), "show");
            displayElement($("#btnUpdateDraft"), "show");   //수정페이지 생성시 삭제
            displayElement($("#btnApprovalReject"), "show");
            break;
        case "update":
            displayElement($("#btnUpdateDraft"), "show");
            displayElement($("#btnDeleteDraft"), "show");
            break;
    }
}

/**
 * 결재문서 열람(로그인한 사용자가 열람하지 않았을 경우에만 실행)
 */
function readDraftDocument() {
    if ('' == $('#approvalLineJson').val()){return;};
    var loginUserCode = $('#loginUserCode').val();
    var approvalLineJson = JSON.parse($('#approvalLineJson').val());

    /**
     * 결재선의 결재코드가 결재대기인 경우
     * @param approvalLineJson
     * @returns {*}
     */
    var getCurrentApprovalLine = function(approvalLineJson){
        for(var i in approvalLineJson){
            if((approvalLineJson[i].approverEmail == loginUserCode)
                && (APPROVAL_LINE.isWaitApproverAppCdList(approvalLineJson[i].approverAppCd))){
                return approvalLineJson[i];
            }
        }
        return '';
    };

    var currentApprovalLine = getCurrentApprovalLine(approvalLineJson);

    if (APPROVAL_LINE.approverAppCd.wait == currentApprovalLine.approverAppCd){
        manageApproval(APPROVAL_LINE.approverAppCd.read);
    }
}

/**
 * 승인, 보류
 * @param approverAppCd
 */
function manageApproval(approverAppCd){
    if ('undefined' == typeof(approverAppCd)){approverAppCd = '';}

    var loginUserCode = $('#loginUserCode').val(),
        docUid = $('#docUid').val();

    var data = {
        "approverAppCd": approverAppCd,
        "loginUserCode": loginUserCode,
        "docUid": docUid
    };

    $.ajax({
        type: 'post',
        url: BASE_APPROVAL_URL + 'doApproval',
        data: data,
        dataType: 'json',
        success: function(data){
            if ('' != data.msg && APPROVAL_LINE.approverAppCd.read != approverAppCd){
                alert(data.msg);
            }
        },
        error: function(e){
            alert(e.status + ':' + e.statusText);
        }
    });
}

/**
 * 기안작성
 */
function doDraft(){
    var draftDocument = {
        "subject": $("#subject").val(),
        "contents": $("#contents").val()
    };

    var data = {
        "draftDocumentJson": JSON.stringify([draftDocument]), //bulkCreate()으로 배열로 변경
        "approvalLineJson": $("#approvalLineJson").val()
    };

    //TODO: data를 string으로 변환하지 않고, jquery옵션사용($.ajaxSettings.traditional)

    $.ajax({
        type: "POST",
        url: BASE_DRAFT_DOCUMENT_URL + "create",
        data: data,
        dataType: "json",
        success: function(data){
            if ("" != data.msg){
                alert(data.msg);
            }
            //TODO: 결재처리 승인호출
        },
        //TODO : 중복키 저장으로 오류시 다시저장하는 로직추가 가능한지 (시도는 1번만)
        error: function(e){
            alert(e.status + ":" + e.statusText);
        }
    });
}

/**
 * 기안문서 조회
 */
function getDraftDocumentInfo(jsonData){
    if ("create" == $("#viewStatus").val()) {return;}

    var selectorDraftDocumentJson = $("#draftDocumentJson"),
        draftDocumentJson = "";

    if (('undefined' != typeof(jsonData)) && ("" != jsonData)){
        selectorDraftDocumentJson.val(jsonData);
        draftDocumentJson = selectorDraftDocumentJson.val();
    } else {
        draftDocumentJson = selectorDraftDocumentJson.val();
    }

    if ("" != draftDocumentJson){
        var draftDocument = $.parseJSON(draftDocumentJson);

        $("#docUid").val(draftDocument.docUid);
        $("#subject").val(draftDocument.subject);
        $("#contents").val(draftDocument.contents);
    }
}

/**
 * 기안수정
 */
function updateDraft(){
    var docUid = $("#docUid").val();

    if ("" == docUid){
        alert('update fail');
        console.log("docUid is not null");
        return;
    }

    var draftDocument = {
        "docUid": docUid,
        "subject": $("#subject").val(),
        "contents": $("#contents").val()
    };

    $.ajax({
        type: "POST",
        url: BASE_DRAFT_DOCUMENT_URL + "update",
        data: draftDocument,
        dataType: "json",
        success: function(data){
            if ("" != data.msg){
                alert(data.msg);
            }
            getDraftDocumentInfo(data.draftDocumentJson);
        },
        error: function(e){
            alert(e.status + ":" + e.statusText);
        }
    });
}

/**
 * 기안삭제
 */
function deleteDraft(){
    var draftDocument = {
        "docUid" : $("#docUid").val()
    };

    $.ajax({
        type: "POST",
        url: BASE_DRAFT_DOCUMENT_URL + "delete",
        data: draftDocument,
        dataType: "json",
        success: function(data){
            if ("" != data.msg){
                alert(data.msg);
            }
        },
        error: function(e){
            alert(e.status + ":" + e.statusText);
        }
    });
}

/**
 * 문서 키값생성
 */
function getDocKey(){
    var docPrefix = "DOC";
    return docPrefix + getCurrentDate('key');
}

/**
 * 오늘 날짜 조회
 */
function getCurrentDate(keyType){
    var curDate = new Date();

    var curYear = ("key" == keyType) ? curDate.getYear()
                                     : curDate.getFullYear();
    var curMonth = curDate.getMonth() + 1;
    var curDay = curDate.getDate();

    var curHour = curDate.getHours();
    if (curHour < 10) curHour = "0" + curHour;
    var curMinute = curDate.getMinutes();
    if (curMinute < 10) curMinute = "0" + curMinute;
    var curSecond = curDate.getSeconds();
    if (curSecond < 10) curSecond = "0" + curSecond;
    var curMillisec = curDate.getMilliseconds();

    return curYear.toString() + curMonth.toString() + curDay.toString()
            + curHour.toString() + curMinute.toString() + curSecond.toString()
            + curMillisec.toString();
}

function displayElement(id, mode){
    // for bootstrap
    if (true == id.hasClass('hidden')){
        if ("show" == mode){
            id.removeClass('hidden');
        } else if ("hide" == mode){
            id.addClass('hidden');
        }

    } else {
        if ("show" == mode){
            id.display.show();
        } else if ("hide" == mode){
            id.display.hide();
        }
    }
}

function displayApprovalLine(){
    //TODO: 결재선 div 호출

    setApprovalLine();
}

function setApprovalLine(){
    var result = JSON.stringify(dataSetApprovalLine);
    var approvalLineJson = $("#approvalLineJson");
    approvalLineJson.val(result);

    if ("" != approvalLineJson.val()){
        alert('결재선을 지정하였습니다.');
    } else {
        alert('결재선 지정에 실패하였습니다.');
    }
}

var dataSetApprovalLine =
    [{
        "approvalLineUid": "uid0",
        "approverEmail": "money0@nonamed.io",
        "approverName": "돈영원",
        "approverOrder": "0",
        "approverAppCd": APPROVAL_LINE.approverAppCd.done
    },{
        "approvalLineUid": "uid1",
        "approverEmail": "money1@nonamed.io",
        "approverName": "돈일원",
        "approverOrder": "1",
        "approverAppCd": APPROVAL_LINE.approverAppCd.wait
    },{
        "approvalLineUid": "uid2",
        "approverEmail": "money2@nonamed.io",
        "approverName": "돈이원",
        "approverOrder": "2",
        "approverAppCd": APPROVAL_LINE.approverAppCd.none
    }];

var dataSetApprovalLine2 =
    [{
        "approvalLineUid": "uid3",
        "approverEmail": "money0@nonamed.io",
        "approverName": "돈영원",
        "approverOrder": "0",
        "approverAppCd": APPROVAL_LINE.approverAppCd.done
    },{
        "approvalLineUid": "uid4",
        "approverEmail": "money1@nonamed.io",
        "approverName": "돈일원",
        "approverOrder": "1",
        "approverAppCd": APPROVAL_LINE.approverAppCd.wait
    },{
        "approvalLineUid": "uid5",
        "approverEmail": "money2@nonamed.io",
        "approverName": "돈이원",
        "approverOrder": "2",
        "approverAppCd": APPROVAL_LINE.approverAppCd.none
    }];