$(document).ready(function(){
    $('#writeDraftDoc').click(function(){
        $(location).attr('href', '/approval/apprDraftDocument');
    });

    $('#readDraftDoc').click(function(){
        $(location).attr('href', '/approval/apprDraftDocument/read');
    });

    $('#waitListDraftDoc').click(function(){
        fnForwardList(fnSetStatusWaitList);
    });

    $('#ongoingListDraftDoc').click(function(){
        fnForwardList(fnSetStatusOngoingList);
    });

    $('#listDraftDoc').click(function(){
        $(location).attr('href', '/approval/apprApprovalList');
    });
});

var fnForwardList = function(fnSetStatus){
    fnSetStatus();
//    $('#loginUserCode').val("sessionLoginId");

    $('#mainForm').attr({
        action: "/approval/apprApprovalList",
        method: "post"
    }).submit();
};

var fnSetStatusWaitList = function(){
    $('#loginUserCode').val("money1@nonamed.io"); //temp
    $('#listType').val(APPROVAL_LIST_TYPE.wait);
    $('#approverAppCd').val(APPROVAL_LINE.waitApproverAppCdList);
};

var fnSetStatusOngoingList = function(){
    $('#loginUserCode').val("");  //temp
    $('#listType').val(APPROVAL_LIST_TYPE.ongoing);
    $('#approverAppCd').val("");
};