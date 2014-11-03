BASE_DRAFT_DOCUMENT_URL="/approval/apprDraftDocument/";

$(document).ready(function(){
    $("#btnHistoryBack").click(function(event){
        event.preventDefault();
        history.back();
    });

    $("#btnDoDraft").click(function(){doDraft();});
    $("#btnUpdateDraft").click(function(){updateDraft();});
    $("#btnDeleteDraft").click(function(){deleteDraft();});
    $("#btnSetApprovalLine").click(function(){displayApprovalLine();});

    initBtn();
    getDraftDocumentInfo();
});

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
            displayElement($("#btnUpdateDraft"), "show");
            displayElement($("#btnDeleteDraft"), "show");
            break;
    }
}

/**
 * 기안작성
 */
function doDraft(){
    var draftDocument = {
        //"docUid": getDocKey(),    //uuid로 변경
        "subject": $("#subject").val(),
        "contents": $("#contents").val()
    };

    var data = {
        "draftDocumentJson": JSON.stringify([draftDocument]), //bulkCreate()으로 배열로 변경
        "approvalLineJson": $("#approvalLineJson").val()
    };

    $.ajax({
        type: "POST",
        url: BASE_DRAFT_DOCUMENT_URL + "create",
        data: data,
        dataType: "json",
        success: function(data){
            if ("" != data.msg){
                alert(data.msg);
            }
        },
        // TODO : 중복키 저장으로 오류시 다시저장하는 로직추가 가능한지 (시도는 1번만)
        error: function(e){
            alert(e.status + ":" + e.statusText);
        }
    });
}

/**
 * 기안문서 조회
 */
function getDraftDocumentInfo(jsonData){
    if ("create" == $("#viewStatus").val()) { return; }

    var selectorDraftDocumentJson = $("#draftDocumentJson");
    var draftDocumentJson = "";

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

var dataSetApprovalLine =[
    {
        "approvalLineUid": "uid0",
        "approverEmail": "money0@nonamed.io",
        "approverName": "돈영원",
        "approverOrder": "0",
        "approverAppCd": "0",
        "approverAppName": "결재대기"
    },{
        "approvalLineUid": "uid1",
        "approverEmail": "money1@nonamed.io",
        "approverName": "돈일원",
        "approverOrder": "1",
        "approverAppCd": "0",
        "approverAppName": "결재대기"
    },{
        "approvalLineUid": "uid2",
        "approverEmail": "money2@nonamed.io",
        "approverName": "돈이원",
        "approverOrder": "2",
        "approverAppCd": "0",
        "approverAppName": "결재대기"
    }];