$(document).ready(function(){
    $("#writeDraftDoc").on("click", function(){
        $(location).attr('href', '/approval/apprWriteDraftDoc');
    });

    $("#approvalLine").on("click", function(){
        $(location).attr('href', '/approval/apprApprovalLine');
    });

    $("#approvalWaitList").on("click", function(){
        $(location).attr('href', '/approval/apprApprovalWaitList');
    });

    $("#approvalDoneList").on("click", function(){
        $(location).attr('href', '/approval/apprApprovalDoneList');
    });
});