BASE_DRAFT_DOCUMENT_URL="/approval/apprDraftDocument/";

$(document).ready(function(){
    $("#btnHistoryBack").click(function(event){
        event.preventDefault();
        history.back();
    });

    $("#btnDoDraft").click(function(){ doDraft(); });
    $("#btnUpdateDraft").click(function(){ updateDraft(); });
    $("#btnDeleteDraft").click(function(){ deleteDraft(); });

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
        "docUid": getDocKey(),
        "subject": $("#subject").val(),
        "contents": $("#contents").val()
    };

    $.ajax({
        type: "POST",
        url: BASE_DRAFT_DOCUMENT_URL + "create",
        data: draftDocument,
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