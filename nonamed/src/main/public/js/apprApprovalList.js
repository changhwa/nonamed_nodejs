$(document).ready(function(){
    $("#btnHistoryBack").click(function(event){
        event.preventDefault();
        history.back();
    });

    var draftDocumentsJson = $("#draftDocumentsJson").val(),
        draftDocumentsTable = $("#draftDocumentsTable"),
        data = $.parseJSON(draftDocumentsJson);

    if ("" != draftDocumentsJson){
        $('#draftDocumentsTable').dataTable({
            data: data,
            columns: [
                {data: 'docUid'},
                {data: 'subject'},
                {data: 'contents'}
            ],
            columnDefs: [{
                "targets": [0], //docUid
                "bVisible": false,
                "searchable": false
            }]
        });

        var oTable = $('#draftDocumentsTable').dataTable();
        $('#draftDocumentsTable tbody td').click(function() {
            var aPos = oTable.fnGetPosition(this);
            var aData = oTable.fnGetData(aPos[0]);
            $("#selectedDocUid").val(aData.docUid);
            fnForwardDraftDocument();
        } );
    }

    $("#draftDocumentsTable_length").remove();      // 리스트 개수 Div
});

function fnForwardDraftDocument(){
    $('#viewStatus').val('update');
    $('#approvalListForm').attr({
        action: '/approval/apprDraftDocument/read',
        method: 'post'
    }).submit();
}