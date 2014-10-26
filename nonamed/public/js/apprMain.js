$(document).ready(function(){
    $("#writeDraftDoc").click(function(){
        $(location).attr('href', '/approval/apprDraftDocument');
    });

    $("#readDraftDoc").click(function(){
        $(location).attr('href', '/approval/apprDraftDocument/read');
    });
});