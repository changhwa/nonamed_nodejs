$(document).ready(function(){
    $('#writeDraftDoc').click(function(){
        $(location).attr('href', '/approval/apprDraftDocument');
    });

    $('#readDraftDoc').click(function(){
        $(location).attr('href', '/approval/apprDraftDocument/read');
    });

    $('#waitListDraftDoc').click(function(){
        fnForwardWaitList();
    });

    $('#listDraftDoc').click(function(){
        $(location).attr('href', '/approval/apprApprovalList');
    });
});

function fnForwardWaitList(){
    var tempId = "money1@nonamed.io";
    $('#listType').val(APPROVAL_LIST_TYPE.wait);
    $('#loginId').val(tempId);

    $('#mainForm').attr({
        action: "/approval/apprApprovalList",
        method: "post"
    }).submit();
}