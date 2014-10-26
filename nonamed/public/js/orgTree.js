var BASE_DEPT_URL = 'http://localhost:3000/depts';
var BASE_USER_URL = 'http://localhost:3000/users';

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
    $("#btn_list")
        .on('click','#add_dept',function(){addDept();})
        .on('click','#add_user',function(){addUser();});
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

    getBreadCrumbs();

    var url = BASE_DEPT_URL + "/tree"; ///depts/tree
    var data = {"deptCode" : getDeptCode()};

    $.ajax({
        type:"GET",
        url:url,
        data: data,
        dataType: 'json',
        success:function(args){
            var dept = args.dept;
            $("#orgView").html('');
            $.each(dept, function(i){
                var template = "<li name='_dept' data-dept-code="+dept[i].code+" data-org-type='dept' class='list-group-item ui-widget-content'><i class='glyphicon glyphicon-folder-close'></i>"+dept[i].dept_name+"</li>";
                $("#orgView").append(template);
            });

            var user = args.user;
            $.each(user, function(i){
                var template = "<li name='_user' data-dept-code="+user[i].code+" data-org-type='user' class='list-group-item'><i class='glyphicon glyphicon-user'></i>"+user[i].name+"</li>";
                $("#orgView").append(template);
            });
            orgDragAndDrop();
        },
        error:function(e){
            alert(e.responseText);
        }
    });
}

function getDeptCode() {
    var deptCode = $("#deptCode").val();
    deptCode = (deptCode == '') ? 0 : deptCode;
    return deptCode;
}
function addDept(){
    var deptCode = getDeptCode();
    var url = BASE_DEPT_URL + "/create";
    var data = {"deptName" : $("#regDeptName").val(), "parentDeptCode" : deptCode};

    $.ajax({
        type:"POST",
        url:url,
        data: data,
        dataType: 'json',
        success:function(args){
            console.log(args);
        },
        error:function(e){
            alert(e.responseText);
        }
    });
}

function addUser(){

    var user = {
        "code" : $("#regUserCode").val(),
        "passwd" : $("#regUserPasswd").val(),
        "name" : $("#regUserName").val(),
        "authKey" : $("#regUserAuthKey").val(),
        "office" : $("#regUserOffice").val(),
        "position" : $("#regUserPosition").val(),
        "securityGrade" : $("#regUserSecurityGrade").val(),
        "deptCode" : getDeptCode()
    };

    $.ajax({
        type:"POST",
        url : BASE_USER_URL +"/create",
        data: user,
        dataType: 'json',
        success:function(args){
            alert(args.msg);
            $("#close_user_add_modal").click();
            getOrgViewTree();
        },
        error: function(e){
            alert('회원가입에 실패하였습니다');
        }
    });
}

function orgDragAndDrop(){
    $("li[name=_dept], li[name=_user]").draggable({
        helper: 'clone',
        cursor: 'move'
    });
    $("a[name=breadcrumb_nav_btn], li[name=_dept]").droppable({
        hoverClass: 'ui-state-hover',
        drop: function(event,ui){
            dropEvent(event, ui);
        }
    });
}

function dropEvent ( event, ui ) {
    $(this).addClass('ui-state-highlight');
    $(ui.draggable).draggable('disable');

    var source = ui.draggable[0].dataset.deptCode;
    var target = event.target.dataset.deptCode;
    var orgType = ui.draggable[0].dataset.orgType;

    orgMove(source,target, orgType);
}

function orgMove(source, target, orgType){

    var data = {
        "source" : source,
        "target" : target
    };

    var type = (orgType == 'user') ? BASE_USER_URL : BASE_DEPT_URL;
    var url = type + "/move";

    $.ajax({
        type:"POST",
        url : url,
        data: data,
        dataType: 'json',
        success:function(args){
            alert(args.msg);
            $("#deptCode").val(target);
            getOrgViewTree();
        },
        error: function(e){
            alert('실패하였습니다');
        }
    });
}

function getBreadCrumbs(){

    var data = {deptCode : getDeptCode()};
    var url = BASE_DEPT_URL + "/breadcrumbs";

    $.ajax({
        type:"GET",
        url:url,
        data: data,
        dataType: 'json',
        success:function(args){
            var dept = $("a[name=breadcrumb_nav_btn]");
            for(var i = dept.length; i>0; i--){
                dept.eq(i).remove();
            }
            var dept = args;
            $.each(dept, function(i){
                var template = '<a href="#" name="breadcrumb_nav_btn" data-dept-code="'+dept[i].code+'" class="btn btn-default">'+dept[i].dept_name+'</a>';
                $("#breadcrumb").append(template);
            });
        }
    });
}