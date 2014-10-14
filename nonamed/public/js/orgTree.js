$(document).ready(function(){
    getOrgViewTree();
    $("#orgView").on('click','li[name=_dept]',function(){
        $("#deptCode").val($(this).data("deptCode"));
        $("#deptName").val($(this).text());
        getOrgViewTree();

    });
    $("#breadcrumb").on('click','a[name=breadcrumb_nav_btn]',function(){
        moveBreadCrumbLink($(this).index());
    });
});

function moveBreadCrumbLink(index){

    var dept = $("a[name=breadcrumb_nav_btn]");

    $("#deptCode").val(dept.eq(index).data("deptCode"));
    $("#deptName").val(dept.eq(index).text());

    for(var i=index; i < dept.length ; i++){
        if(i == 0){
            continue;
        }
        var currentDept = dept.eq(i);
        currentDept.remove();
    }

    getOrgViewTree();
}

function getOrgViewTree(){

    var currentDeptCode = $("#deptCode").val();

    if(currentDeptCode != ''){
        var template = '<a href="#" name="breadcrumb_nav_btn" data-dept-code="'+currentDeptCode+'" class="btn btn-default">'+$("#deptName").val()+'</a>';
        $("#breadcrumb").append(template);
    } else {
        currentDeptCode = '1';
    }

    var url = "http://localhost:3000/depts/tree";
    var data = {"deptCode" : currentDeptCode};

    $.ajax({
        type:"GET",
        url:url,
        data: data,
        dataType: 'json',
        success:function(args){
            var dept = args;
            $("#orgView").html('');
            $.each(dept, function(i){
                var template = "<li name='_dept' data-dept-code="+dept[i].code+" class='list-group-item'><i class='glyphicon glyphicon-folder-close'></i>"+dept[i].dept_name+"</li>";
                $("#orgView").append(template);
            });
        },
        error:function(e){
            alert(e.responseText);
        }
    });
}
