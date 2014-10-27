BASE_DRAFT_DOCUMENT_URL="/approval/apprApprovalList/";

$(document).ready(function(){
    $("#btnHistoryBack").click(function(event){
        event.preventDefault();
        history.back();
    });


    // TODO: jquery로 구현예정
    var draftDocumentsJson = $("#draftDocumentsJson").val();
    var dataSet = $.parseJSON(draftDocumentsJson);

    if ("" != draftDocumentsJson) {
        $('#draftDocumentsTable').dataTable({
            "data": dataSet,
            columns: [
                //{ data: 'docUid' },
                { data: 'subject' },
                { data: 'contents' }
            ]
        });
    }

    $("#draftDocumentsTable_length").remove();      // 리스트 개수
});