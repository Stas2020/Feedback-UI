

var DepartmentList = [];
var CheckLists = [];
var Domains = [];
var RoleFuncsAndRights = [];

    var UserDepartments = [];
    var Functions = [];
    var Roles = [];
    var Users = [];
var ajax_count = 0;

var symbolEdit = "✎";//"🖍 ✎";
var symbolFunc = "ƒ";
var symbolPlus = "➕";
var symbolPlusSmall = "+";
var symbolDelete = "🗑";//"🗑 🧺";
var symbolView = "👁";//👁" 👀";

var symbolActive = "✔";//"✓";//"☑";
var symbolDeactive = "❌";//"☐";

//var symbolRefresh = "🗘 ↻ ↺"; &#128472; &#8635; 	&#8634;


const accessDelete = 3;
const accessEdit = 2;
const accessAdd = 1;
const accessView = 0;
var accessStrings = ["View", "Add", "Edit", "Del"]
var accessSymbols = [symbolView, symbolPlusSmall, symbolEdit, symbolDelete];
var accessSymbolSizes = [16, 20, 16, 16];

   var Grid_users;
var Grid_roles;
var Grid_functions;
var Grid_domains;

    var id_for_answer;
    var id_feedback;
var user_id;
var ExpandUserFuncs = false;

    var newMark = false;

    var StartDate;
    var EndDate;

    var dataSource;
    var appeals_id = -1;
    var RoleUser;
var host = "s2010";
var complaints = "/complaints";


// переменные окон
var departmentsUserId;
var departmentsUserHasChanged;

var editUserId;
var editUserPwdChanged;

var functionCheckListFuncId;
var functionCheckListHasChanged;

var editFuncId;

var editRoleId;

var editDomainId;

var editFuncRightsFuncId;
var editFuncRightsRoleId;


//var activateButtonLabel = ["Актив.", "Деакт."]

    $(document).ready(function () {
		host = window.location.hostname;

        // При отладке на локальном, возвращать host вместе с портом
        if (host == "localhost")
        {
            host = window.location.host;
            complaints = "";
        }

        $("#exit").kendoButton({
            click: onExit,
            visible: false
        });

        $("#Button_login").kendoButton({
            click: onLogin
        });


        $( "#password" ).keypress(function(event) {
            if (event.keyCode === 13) {
                onLogin();
            }
        });
                

        $("#button_user_add").kendoButton({ click: AddUser });
        $("#button_function_add").kendoButton({ click: AddFunction });
        $("#button_role_add").kendoButton({ click: AddRole });
        $("#button_domain_add").kendoButton({ click: AddDomain });

        $("#button_user_refresh").kendoButton({ click: RefreshAll });
        $("#button_role_refresh").kendoButton({ click: RefreshAll });
        $("#button_function_refresh").kendoButton({ click: RefreshAll });
        $("#button_domain_refresh").kendoButton({ click: RefreshAll });


        var window_login = $("#window_login")
        window_login.kendoWindow({
                actions: {},
                width: "400px",
                height: "170px",
                modal: true,
                resizable:false,
                title: "Авторизироваться",
                visible: false,
                open: adjustSize
            });

        $("#window_login").data("kendoWindow").center().open();



        var window_user_deps = $("#window_user_deps")
        window_user_deps.kendoWindow({
            actions: ["Close"],
            width: "374px",
            height: "400px",
            modal: true,            
            resizable: false,
            title: "Подразделения пользователя",
            visible: false,
            //open: adjustSize,
            adjustSize: {
                width: 374,
                height: 400
        }
        });

        $("#window_user_deps").data("kendoWindow")
            .bind("close", function (e) {
                if (departmentsUserHasChanged) {
                    ShowGridUsers(false);
                }
                departmentsUserId = -1;
            }); 
        

        $("#user_subdivision_add").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#user_subdivisions").kendoListBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });

        $("#button_user_dep_add").kendoButton({ click: AddDepartmentToUser });
        $("#button_user_dep_delete").kendoButton({ click: DeleteDepartmentOfUser });

        $("#closeButtonUserDeps").kendoButton({ click: onClickButtUserDepsClose });


        var window_user = $("#window_user")
        window_user.kendoWindow({
            actions: ["Close"],
            width: "548px",
            height: "322px",
            modal: true,
            resizable: false,
            title: "Создать пользователя",
            visible: false,
            //open: adjustSize,
            adjustSize: {
                width: 548,
                height: 322
            }
        });

        $("#user_role_select").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });

        $("#button_user_change_pass").kendoButton({ click: changePwdButtonUser });

        $("#okButtonUser").kendoButton({ click: onClickButtUserOk });





        var window_func_checks = $("#window_func_checks")
        window_func_checks.kendoWindow({
            actions: ["Close"],
            width: "374px",
            height: "404px",
            modal: true,
            resizable: false,
            title: "Список CheckLists функции",
            visible: false,
            //open: adjustSize,
            adjustSize: {
                width: 374,
                height: 404
            }
        });

        $("#window_func_checks").data("kendoWindow")
            .bind("close", function (e) {
                if (functionCheckListHasChanged) {
                    ShowGridUsers(false);
                    ShowGridFunctions(false);
                    ShowGridRoles(false);
                }
                functionCheckListFuncId = -1;
            });


        $("#func_checklist_add").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#func_checklists").kendoListBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });

        $("#button_func_check_add").kendoButton({ click: AddCheckListToFunction });
        $("#button_func_check_delete").kendoButton({ click: DeleteCheckListsOfFunction });

        $("#closeButtonFuncChecks").kendoButton({ click: onClickButtFuncChecksClose });





        var window_func = $("#window_function")
        window_func.kendoWindow({
            actions: ["Close"],
            width: "278px",
            height: "230px",
            modal: true,
            resizable: false,
            title: "Создать функцию",
            visible: false,
            //open: adjustSize,
            adjustSize: {
                width: 278,
                height: 230
            }
        });

        $("#function_domain_select").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });

        $("#okButtonFunc").kendoButton({ click: onClickButtFuncOk });





        var window_role = $("#window_role")
        window_role.kendoWindow({
            actions: ["Close"],
            width: "274px",
            height: "170px",
            modal: true,
            resizable: false,
            title: "Создать роль",
            visible: false,
            //open: adjustSize,
            adjustSize: {
                width: 273,
                height: 170
            }
        });

        $("#okButtonRole").kendoButton({ click: onClickButtRoleOk });



        var window_domain = $("#window_domain")
        window_domain.kendoWindow({
            actions: ["Close"],
            width: "274px",
            height: "166px",
            modal: true,
            resizable: false,
            title: "Создать домен",
            visible: false,
            //open: adjustSize,
            adjustSize: {
                width: 274,
                height: 166
            }
        });

        $("#okButtonDomain").kendoButton({ click: onClickButtDomainOk });



        var window_func_rights = $("#window_function_rights")
        window_func_rights.kendoWindow({
            actions: ["Close"],
            width: "366px",
            height: "298px",
            modal: true,
            resizable: false,
            title: "Добавить функцию в роль",
            visible: false,
            //open: adjustSize,
            adjustSize: {
                width: 366,
                height: 298
            }
        });

        $("#function_rights_function_select").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            //select: onSelectRoleFunc,
            dataSource: []
        });
        $("#okButtonFuncRights").kendoButton({ click: onClickButtRoleFuncOk });



    });

function adjustSize()
{
    if ($(window).width() < 1000 || $(window).height() < 600) { this.maximize(); }
}


function ExpandCollapseUserFuncs() {
    if (ExpandUserFuncs == false) {
        $('#ExpandCollapseButton').text("Свернуть");

        var grid = $("#grid_users").data("kendoGrid");
        $(".k-master-row").each(function (index) {
            grid.expandRow(this);
        });
        ExpandUserFuncs = true;
    }
    else {
        $('#ExpandCollapseButton').text("Развернуть");

        var grid = $("#grid_users").data("kendoGrid");
        $(".k-master-row").each(function (index) {
            grid.collapseRow(this);
        });
        ExpandUserFuncs = false;
    }
}

function beep2() {
    var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}

function onLogin() {
    beep2();
    var username = $("#username").val();
    var password = sha256($("#password").val());

    $.ajax({
        url: "https://" + host + complaints+"/api/auth/getuser?Login=" + username + "&Password=" + password,
        type: "GET",
        success: function (data) {

            if (typeof (data) == "object") {

                if (data.Id == -1) {
                    user_id = data.id;
                    $("#login-message").text("Нет доступа");
                }
                else {

                    user_id = data.Id;

                    RoleUser = new Object();
                    RoleUser.UserId = data.Id;
                    RoleUser.AvailableFunction = [];

                    data.FuncList.forEach(function (item) {

                        item.Role;

                        var Function = new Object();
                        Function.FunctionId = item.Function.FunctionId;

                        var Permissions = new Object();
                        Permissions.Edit = item.NativeRight.Edit;
                        Permissions.Delete = item.NativeRight.Delete;
                        Permissions.Add = item.NativeRight.Add;
                        Permissions.View = item.NativeRight.View;

                        Function.Permissions = Permissions;

                        RoleUser.AvailableFunction[item.Function.FunctionName] = Function;

                    });

                    RoleUser.CheckLists = data.CheckLists;


                    $("#window_login").data("kendoWindow").center().close();
                    $("#login-message").text("");


                    if (RoleUser.AvailableFunction.UserRights && RoleUser.AvailableFunction.UserRights.Permissions.Add) {
                        $("#tools_users").css("display", "inline");
                        $("#tools_roles").css("display", "inline");
                        $("#tools_functions").css("display", "inline");
                        $("#tools_domains").css("display", "inline");
                    }

                    $("#box_grid").css("display", "");

                    $("#tabs").css("display", "");
                    $("#tab-content").css("display", "block");
                    

                    getAllData(true, false);

                }
            } else {
                onExit();
            }
        }
    });


};

function onExit() {
    user_id = -1;

    $("#window_login").data("kendoWindow").center().open();
    $("#tools_users").css("display", "none");
    $("#tools_roles").css("display", "none");
    $("#tools_functions").css("display", "none");
    $("#tools_domains").css("display", "none");
    $("#tabs").css("display", "none");
    $("#tab-content").css("display", "none");

    $("#grid_users").data("kendoGrid").destroy();
    $("#grid_roles").data("kendoGrid").destroy();
    $("#grid_functions").data("kendoGrid").destroy();
    $("#grid_domains").data("kendoGrid").destroy();

    //EraseCheckList();


}

// ***** Шаблоны доступа расшивровка таблиц истинности

function getAccess(rightsTemplate, accessType)
{
    var rights = rightsTemplate > 100 ? 0 : rightsTemplate;
    bit = (rights >> accessType) & 0x1;
    return Boolean(bit);
}

function getAccessTemplate(Del, Edit, Add, View) {
    if (!Del && !Edit && !Add && !View)
        return 1002;
    else
        return parseInt(String(Number(Del)) + String(Number(Edit)) + String(Number(Add)) + String(Number(View)), 2);
}

// ***** Шаблоны доступа - отображение

function getAccessWithTags(accessType, hasAccess) {
    return (hasAccess ? "<span style=\"color:green\">" : "<strike style=\"color:red\">") + accessStrings[accessType] + (hasAccess ? "</span>" : "</strike>");
}
function getAccessWithTagsUnicode(accessType, hasAccess) {
    return ("<font face='Arial Unicode MS'"
        + (hasAccess
            ? "style='color:green;font-size:" + accessSymbolSizes[accessType] + "pt'>"
            : "style='color:red;font-size:" + accessSymbolSizes[accessType] + "pt'><strike>"))
        + accessSymbols[accessType]
        + (hasAccess ? "" : "</strike>")
        + "</font>";
    //res += "<font style='color:red' face='Arial Unicode MS'><h7><s>" + symbolView + " " + symbolPlus + symbolPlusSmall + " " + symbolEdit + " " + symbolDelete + "</s></h7></font><br/>"
}







// ***** Получение данных

function RefreshAll() {
    getAllData(false, true);
}

function getAllData(_initTable, _refreshTable) {
    getDepartments(true, _initTable, _refreshTable);
}

function getDepartments(_executeChain, _initTable, _refreshTable, _refreshAllTables = false) {
    $.ajax({
        url: "https://" + host + complaints + "/api/Info/GetDepartments",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {

                DepartmentList = [];
                data.forEach(function (item) {
                    DepartmentList.push(item);
                });
                if (_executeChain)
                    getUserDepartments(_executeChain, _initTable, _refreshTable);

                if (_refreshAllTables) {
                    ShowGridDomains(false);
                    ShowGridFunctions(false);
                    ShowGridRoles(false);
                    ShowGridUsers(false);
                }
            } else {
                onExit();
            }
        }
    });
}
function getUserDepartments(_executeChain, _initTable, _refreshTable, _refreshAllTables = false) {
    $.ajax({
        url: "https://" + host + complaints + "/api/Info/GetUserDepLinks",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {
                UserDepartments = [];
                data.forEach(function (item) {
                    UserDepartments.push(item);
                });
                if (_executeChain)
                    getCheckLists(_executeChain, _initTable, _refreshTable);

                if (_refreshAllTables) {
                    ShowGridDomains(false);
                    ShowGridFunctions(false);
                    ShowGridRoles(false);
                    ShowGridUsers(false);
                }
                if (departmentsUserId != -1)
                    RefreshUserDepartmentsControls(departmentsUserId);
            } else {
                onExit();
            }
        }
    });
}
function getCheckLists(_executeChain, _initTable, _refreshTable, _refreshAllTables = false) {
    $.ajax({
        url: "https://" + host + complaints + "/api/CheckList/GetCheckListsCollection",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {

                CheckLists = [];
                data.forEach(function (item) {
                    CheckLists.push(item);
                });
                if (_executeChain)
                    getRoleFuncsAndRights(_executeChain, _initTable, _refreshTable);

                if (_refreshAllTables) {
                    ShowGridDomains(false);
                    ShowGridFunctions(false);
                    ShowGridRoles(false);
                    ShowGridUsers(false);
                }
                if (functionCheckListFuncId != -1)
                    RefreshFunctionCheckListsControls(functionCheckListFuncId);

            } else {
                onExit();
            }
        }
    });
}
function getRoleFuncsAndRights(_executeChain, _initTable, _refreshTable, _refreshAllTables = false) {
    $.ajax({
        url: "https://" + host + complaints + "/api/Rights/GetRoleFunctionsRights",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {

                RoleFuncsAndRights = [];
                data.forEach(function (item) {
                    RoleFuncsAndRights.push(item);
                });
                if (_executeChain)
                    getDomains(_executeChain, _initTable, _refreshTable);

                if (_refreshAllTables) {
                    ShowGridDomains(false);
                    ShowGridFunctions(false);
                    ShowGridRoles(false);
                    ShowGridUsers(false);
                }
            } else {
                onExit();
            }
        }
    });
}
function getDomains(_executeChain, _initTable, _refreshTable, _refreshAllTables = false) {
    $.ajax({
        url: "https://" + host + complaints + "/api/Rights/GetDomains",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {

                Domains = [];
                data.forEach(function (item) {
                    Domains.push(item);
                });
                if (_executeChain)
                    getFunctions(_executeChain, _initTable, _refreshTable);

                if (_refreshAllTables) {
                    ShowGridDomains(false);
                    ShowGridFunctions(false);
                    ShowGridRoles(false);
                    ShowGridUsers(false);
                }
                else if (_initTable || _refreshTable)
                    ShowGridDomains(_initTable);

                var sourceDomains = Domains;
                sourceDomains.sort(function (a, b) { return a.DomainName - b.DomainName; });
                sourceDomains = sourceDomains.map(function (_domain) { return { value: _domain.DomainId, text: _domain.DomainName }; });
                $("#function_domain_select").data("kendoComboBox").setDataSource(sourceDomains);

            } else {
                onExit();
            }
        }
    });
}
function getFunctions(_executeChain, _initTable, _refreshTable, _refreshAllTables = false) {
    $.ajax({
        url: "https://" + host + complaints + "/api/Rights/GetFunctions",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {

                Functions = [];
                data.forEach(function (item) {
                    Functions.push(item);
                });
                if (_executeChain)
                    getRoles(_executeChain, _initTable, _refreshTable);

                if (_refreshAllTables) {
                    ShowGridDomains(false);
                    ShowGridFunctions(false);
                    ShowGridRoles(false);
                    ShowGridUsers(false);
                }
                else if (_initTable || _refreshTable)
                    ShowGridFunctions(_initTable);
                
                var sourceFunctions = Functions;
                sourceFunctions.sort(function (a, b) { return a.FunctionName - b.FunctionName; });
                sourceFunctions = sourceFunctions.map(function (_func) {
                    return {
                        value: _func.FunctionId,
                        text: _func.FunctionName + " (" + Domains.filter(_dom => _dom.DomainId == _func.DomainId)[0].DomainName + ")"
                    };
                });
                $("#function_rights_function_select").data("kendoComboBox").setDataSource(sourceFunctions);

            } else {
                onExit();
            }
        }
    });
}

function getRoles(_executeChain, _initTable, _refreshTable, _refreshAllTables = false) {
    $.ajax({
        url: "https://" + host + complaints + "/api/Rights/GetRoles",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {

                Roles = [];
                data.forEach(function (item) {
                    Roles.push(item);
                });
                if (_executeChain)
                    getUsers(_executeChain, _initTable, _refreshTable);

                if (_refreshAllTables) {
                    ShowGridDomains(false);
                    ShowGridFunctions(false);
                    ShowGridRoles(false);
                    ShowGridUsers(false);
                }
                else if (_initTable || _refreshTable)
                    ShowGridRoles(_initTable);

                var sourceRoles = Roles;
                sourceRoles.sort(function (a, b) { return a.RoleName - b.RoleName; });
                sourceRoles = sourceRoles.map(function (_role) { return { value: _role.RoleId, text: _role.RoleName }; });
                $("#user_role_select").data("kendoComboBox").setDataSource(sourceRoles);

            } else {
                onExit();
            }
        }
    });
}

function getUsers(_executeChain, _initTable, _refreshTable, _refreshAllTables = false) {
    $.ajax({
        url: "https://" + host + complaints + "/api/Auth/GetUsers",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {
                Users = [];
                data.forEach(function (item) {
                    Users.push(item);
                });
                if (_executeChain)
                    ;// Получить список юзеров - последняя функция

                if (_refreshAllTables) {
                    ShowGridDomains(false);
                    ShowGridFunctions(false);
                    ShowGridRoles(false);
                    ShowGridUsers(false);
                }
                else if (_initTable || _refreshTable)
                    ShowGridUsers(_initTable);



                // ToDo - напоминалка о коммите, потом убрать
                if (Users.filter(_user => _user.RoleId == 0).length == Users.length && $("#tools_users").html().indexOf("TestWebAPI")==-1)
                    $("#tools_users").append("<h4 style='color:red'>Для корректной работы нужно принять коммит от 01.06 сборки TestWebAPI</h4>");

            } else {
                onExit();
            }
        }
    });
}



// ***** Отрисовка гридов


function detailInit(e) {
    var detailRow = e.detailRow;

    if (e.data.RoleId == 0) {
        detailRow.find(".userRoleFuncs").html("<h5 style='color:red'>Ошибка API. Роль пользователя не определена</h5>");
        return;
    }

    var roleFuncHTML = getRoleFunctionsAsHTML(e.data.RoleId);
    if (roleFuncHTML == "")
        roleFuncHTML = "<h6>Функции роли отсутствуют</h6>";

    roleFuncHTML = "<button class='k-primary k-button'; onclick='AddFunctionsRole(" + e.data.RoleId + ")'>" + "Добавить функцию в роль" + "</button>" +
        "<div style='height:10px;width:100%'></div>" +
        roleFuncHTML;

    detailRow.find(".userRoleFuncs").html(roleFuncHTML);
    
}


function ShowGridUsers(contructData) {
    if (!contructData) {
        $("#grid_users").data("kendoGrid").setDataSource(Users);
        return;
    }

    var usersColumns = [{
        field: "Id",
        title: "Id",
        width: 60,
        resizable: false
    }, {
        field: "Login",
        title: "Логин",
        width: 110,
        minResizableWidth: 80
    }
        , {
        field: "FirstName",
        title: "Имя",
        width: 110,
        minResizableWidth: 80
    }, {
        field: "LastName",
        title: "Фамилия",
        width: 110,
        minResizableWidth: 80
    }, {
        field: "UserRole",
        title: "Роль пользователя",
        width: 110,
        minResizableWidth: 80,
        template: function (dataItem) {
            var role = Roles.find(dom => dom.RoleId == dataItem.RoleId);
            resultStr = "";
            if (role != null) {
                resultStr = "<div style='display:inline;float:left;width:60px'>" + role.RoleName + "</div>";
            }
            return resultStr;
        }
    }, {
        field: "UserCheckLists",
        title: "CheckLists",
        width: 50,
        minResizableWidth: 50,
        template: function (dataItem) {
            var roleFuncIds = RoleFuncsAndRights.filter(_roleFunc => _roleFunc.RoleId == dataItem.RoleId).map(_roleF => _roleF.FunctionId);
            var checkLists = CheckLists.filter(chList => chList.FunctionList.some(fInList => roleFuncIds.includes(fInList)));
            checkLists = checkLists.map(list => list.CheckListName);

            return (checkLists.length > 0 ? (checkLists.length + " шт") : "&nbsp;");
        }
    }
    ];



    Domains.forEach(domain => {
        usersColumns.push(
            {
                field: domain.DomainName,
                title: domain.DomainName,
                width: 105,
                minResizableWidth: 105,
                resizable: false,
                template: function (dataItem) {
                    var domainFuncIds = Functions.filter(_func => _func.DomainId == domain.DomainId).map(_fun => _fun.FunctionId);
                    var roleFunctions = RoleFuncsAndRights.filter(_roleFunc => _roleFunc.RoleId == dataItem.RoleId && domainFuncIds.includes(_roleFunc.FunctionId));
                    var access = [false, false, false, false];
                    // Суммировать права доступа по домену
                    roleFunctions.forEach(_roleFunc => {
                        for (i = 0; i < 4; i++) {
                            access[i] = access[i] || getAccess(_roleFunc.NativeRight, i);
                        }
                    });
                    return getAccessWithTagsUnicode(accessView, access[accessView]) + "&nbsp;&nbsp;" +
                        getAccessWithTagsUnicode(accessAdd, access[accessAdd]) + "&nbsp;&nbsp;" +
                        getAccessWithTagsUnicode(accessEdit, access[accessEdit]) + "&nbsp;&nbsp;" +
                        getAccessWithTagsUnicode(accessDelete, access[accessDelete]);
                }
            });
    })


    usersColumns.push(
        {
            field: "UserDepartments",
            title: "Подразделения пользователя",
            width: 180,
            minResizableWidth: 80,
            template: function (dataItem) {
                var userDeps = UserDepartments.filter(usDep => usDep.UserId == dataItem.Id).map(dep => dep.DepId);
                var depNames = DepartmentList.filter(dep => userDeps.includes(dep.DepId)).map(dp => String(dp.DepName).replace(" ", "&nbsp;") + "&nbsp;(" + dp.DepNum + ")");
                resultStr = "<div style='display:inline;float:left;width:60px'>" + depNames.join(",&nbsp;") + "</div>";
                if (RoleUser.AvailableFunction.UserRights && RoleUser.AvailableFunction.UserRights.Permissions.Edit) {
                    resultStr += "<div style='display:inline;float:right'>" + "<button class='k-primary k-button' style='width:30px;min-width:30px' onclick='EditDepartmentsUser(" + dataItem.Id + ")'>" + symbolEdit + "</button>" + "</div>"
                }
                return resultStr;
            }
        }, {
        field: "IsActive",
        title: "Активен",
        width: 35,
        minResizableWidth: 35,
        template: function (dataItem) {
            return (dataItem.IsActive ? symbolActive : symbolDeactive) + "&nbsp;" + String(dataItem.isActive);
        }
    }
        , {
            field: "Editing",
            title: "User",
            width: 100,
            minResizableWidth: 100,
            template: function (dataItem) {

                if (RoleUser.AvailableFunction.UserRights) {
                    resultButtons = "";
                    if (RoleUser.AvailableFunction.UserRights.Permissions.Edit) {
                        resultButtons += "<button class='k-primary k-button'  style='width:30px;min-width:30px'; onclick='EditUser(" + dataItem.Id + ")'>" + symbolEdit + "</button>&nbsp;" +
                            "<button class='k-primary k-button'  style='width:30px;min-width:30px'; onclick='DeleteUser(" + dataItem.Id + ")'>" + symbolDeactive + "</button>";
                    }
                    return resultButtons;
                }
                else {
                    return "";
                }
            }
        }
    );



    var height = $(window).height() - 190;

    Grid_users = $("#grid_users").kendoGrid({
        dataSource: Users,

        editable: false,
        //height: height,
        groupable: false,
        sortable: {
            initialDirection: "asc"
        },
        //filterable: true,
        resizable: true,

        columns: usersColumns
        ,
        detailTemplate: kendo.template($("#detail-template").html()),
        detailInit: detailInit,
        dataBound: function (e) {
            var grid = e.sender;
 

            grid.tbody.find("tr.k-master-row").click(function (e) {
                var target = $(e.target);
                if ((target.hasClass("k-i-expand")) || (target.hasClass("k-i-collapse")) || (target.hasClass("k-button"))) {
                    return;
                }

                var row = target.closest("tr.k-master-row");
                var icon = row.find(".k-i-expand");

                if (icon.length) {
                    grid.expandRow(row);
                } else {
                    grid.collapseRow(row);
                }
            })

            $('#ExpandCollapseButton').text("Развернуть");
            Expand = false;

        },
        sort: function (e) {
            $('#ExpandCollapseButton').text("Развернуть");
            Expand = false;
        },
        filter: function (e) {
            $('#ExpandCollapseButton').text("Развернуть");
            Expand = false;
        }


    });



}





function getRoleFunctionsAsHTML(roleId) {//, headerText = null) {
    strResult = "";
    var roleFuncs = RoleFuncsAndRights.filter(roleFunc => roleFunc.RoleId == roleId);

    var functionsStr = [];

    roleFuncs.forEach(roleFunc => {
        var func = Functions.find(fn => fn.FunctionId == roleFunc.FunctionId);
        if (func != null && func.isActive) {
            var domain = Domains.find(dm => dm.DomainId == func.DomainId);
            var checkLists = CheckLists.filter(chList => chList.FunctionList.includes(func.FunctionId));
            checkLists = checkLists.map(list => list.CheckListName);


            checkListsStr = "<div style=\"display:inline\">" + (checkLists != null ? checkLists.join("<br/>") : "&nbsp;") + "</div>";
            if (RoleUser.AvailableFunction.UserRights && RoleUser.AvailableFunction.UserRights.Permissions.Edit) {
                checkListsStr += "<div style='display:inline;float:right'>" + "<button class='k-primary k-button'  style='width:30px;min-width:30px' onclick='EditCheckListsFunction(" + func.FunctionId + ")'>" + symbolEdit + "</button>&nbsp;" + "</div>"
            }

            str = "<table border=0 style='width:100%;margin:-5px'>" +
                "   <tr>" +
                "       <td>" +
                "           <div style='width:100%;border-width:1px;border-style:solid;border-color:#DDDDDD;border-radius:3px;'>" +
                "               <table border=0 style='width:100%;'>" +
                "                   <tr>" +
                "                       <td>" + func.FunctionName + "</td>" +
                "                       <td>" + checkListsStr + "</td>" +
                "                       <td>" + (domain != null ? domain.DomainName : "без домена") + "</td>" +
                "                       <td>" +
                getAccessWithTags(accessView, getAccess(roleFunc.NativeRight, accessView)) + "&nbsp;" + "&nbsp;" +
                getAccessWithTags(accessAdd, getAccess(roleFunc.NativeRight, accessAdd)) + "&nbsp;" + "&nbsp;" +
                getAccessWithTags(accessEdit, getAccess(roleFunc.NativeRight, accessEdit)) + "&nbsp;" + "&nbsp;" +
                getAccessWithTags(accessDelete, getAccess(roleFunc.NativeRight, accessDelete)) +
                "                       </td>" +
                "                   </tr>" +
                "               </table>" +
                "           </div>" +
                "       </td>"
            if (RoleUser.AvailableFunction.UserRights && RoleUser.AvailableFunction.UserRights.Permissions.Edit) {
                str += "<td style='width:77px'>" +
                    "<button class='k-primary k-button' style='width:30px;min-width:30px' onclick='EditFunctionsRoleRights(" + roleId + "," + func.FunctionId + ")'>" + symbolEdit + "</button>" +
                    "<button class='k-primary k-button' style='width:30px;min-width:30px' onclick='DeleteFunctionsRole(" + roleId + "," + func.FunctionId + ")'>" + symbolDelete + "</button>" +
                    "</td>";
            }
            str += "</tr>" +
                "</table>";

            functionsStr.push(str);
        }
    });

    strResult = functionsStr.join("");

    return strResult;
}



function ShowGridRoles(contructData) {
    if (!contructData) {
        $("#grid_roles").data("kendoGrid").setDataSource(Roles);
        return;
    }

    var height = $(window).height() - 190;

    Grid_roles = $("#grid_roles").kendoGrid({
        dataSource: Roles,

        editable: false,
        groupable: false,
        sortable: {
            initialDirection: "asc"
        },
        resizable: true,
        columns: [{
            field: "RoleId",
            title: "Id",
            width: 60,
            resizable: false
        }, {
            field: "RoleName",
            title: "Название роли",
            width: 160,
            minResizableWidth: 80
            }


            , {
                field: "Functions",
                title: "Функции роли (имя функции, checkLists, домен, права)",
                width: 450,
                minResizableWidth: 200,
                template: function (dataItem) {
                    return getRoleFunctionsAsHTML(dataItem.RoleId);
                }
            }

            , {
                field: "isActive",
                title: "Активна",
                width: 35,
                minResizableWidth: 35,
                template: function (dataItem) {
                    return (dataItem.isActive ? symbolActive : symbolDeactive) + "&nbsp;" + String(dataItem.isActive);
                }
            }

            , {
                field: "Editing",
                title: "Роль",
                width: 120,
                minResizableWidth: 120,
                template: function (dataItem) {

                    if (RoleUser.AvailableFunction.UserRights) {
                        resultButtons = "";
                        if (RoleUser.AvailableFunction.UserRights.Permissions.Edit) {
                            resultButtons += "<button class='k-primary k-button' style='width:30px;min-width:30px'; onclick='EditRole(" + dataItem.RoleId + ")'>" + symbolEdit + "</button>&nbsp;"+
                                "<button class='k-primary k-button' style='width:45px;min-width:45px'  onclick='AddFunctionsRole(" + dataItem.RoleId + ")'>" + symbolPlus + "&nbsp;" + symbolFunc + "</button>&nbsp;" +
                                "<button class='k-primary k-button'  style='width:30px;min-width:30px'; onclick='ActivateRole(" + dataItem.RoleId + ")'>" + symbolActive + "</button>&nbsp;" +
                                "<button class='k-primary k-button'  style='width:30px;min-width:30px'; onclick='DeleteRole(" + dataItem.RoleId + ")'>" + symbolDeactive + "</button>";
                        }
                        return resultButtons;
                    }
                    else {
                        return "";
                    }                    
                }
            }


        ]

    });
}







function ShowGridFunctions(contructData) {
    if (!contructData) {
        $("#grid_functions").data("kendoGrid").setDataSource(Functions);
        return;
    }

    var height = $(window).height() - 190;

    Grid_functions = $("#grid_functions").kendoGrid({

        dataSource: Functions,

        editable: false,
        groupable: false,
        sortable: {
            initialDirection: "asc"
        },
        resizable: true,
        columns: [{
            field: "FunctionId",
            title: "Id",
            width: 60,
            resizable: false
        }, {
            field: "FunctionName",
            title: "Название функции",
            width: 160,
            minResizableWidth: 80
        }

            , {
                field: "DomainName",
                title: "Домен функции",
                width: 160,
                minResizableWidth: 80,
                template: function (dataItem) {
                    var domain = Domains.find(dom => dom.DomainId == dataItem.DomainId);
                    return (domain != null) ? domain.DomainName : "";
                }


            }
            ,{
                field: "CheckLists",
                title: "CheckLists",
                width: 120,
                minResizableWidth: 120,
                template: function (dataItem) {
                    var checkLists = CheckLists.filter(chList => chList.FunctionList.includes(dataItem.FunctionId));
                    checkLists = checkLists.map(list => list.CheckListName);

                    resultStr = "<div style=\"display:inline\">" + checkLists.join(", ") + "</div>";
                    if (RoleUser.AvailableFunction.UserRights && RoleUser.AvailableFunction.UserRights.Permissions.Edit) {
                        resultStr += "<div style='display:inline;float:right'>" + "<button class='k-primary k-button' style='width:30px;min-width:30px' onclick='EditCheckListsFunction(" + dataItem.FunctionId + ")'>" + symbolEdit + "</button>&nbsp;" + "</div>"
                    }

                    return resultStr;
                }
            }
            , {
                field: "isActive",
                title: "Активна",
                width: 35,
                minResizableWidth: 35,
                template: function (dataItem) {
                    return (dataItem.isActive ? symbolActive : symbolDeactive) + "&nbsp;" + String(dataItem.isActive);
                }
            }

            , {
                field: "Editing",
                title: "Функция",
                width: 120,
                minResizableWidth: 120,
                template: function (dataItem) {

                    if (RoleUser.AvailableFunction.UserRights) {
                        resultButtons = "";
                        if (RoleUser.AvailableFunction.UserRights.Permissions.Edit) {
                            resultButtons += "<button class='k-primary k-button' style='width:30px;min-width:30px'; onclick='EditFunction(" + dataItem.FunctionId + ")'>" + symbolEdit + "</button>&nbsp;" +
                                "<button class='k-primary k-button'  style='width:30px;min-width:30px'; onclick='ActivateFunction(" + dataItem.FunctionId + ")'>" + symbolActive + "</button>&nbsp;" +
                                "<button class='k-primary k-button'  style='width:30px;min-width:30px'; onclick='DeleteFunction(" + dataItem.FunctionId + ")'>" + symbolDeactive + "</button>";
                        }
                        return resultButtons;
                    }
                    else {
                        return "";
                    }

                }
            }
        ]

    });
}



function ShowGridDomains(contructData) {
    if (!contructData) {
        $("#grid_domains").data("kendoGrid").setDataSource(Domains);
        return;
    }

    var height = $(window).height() - 190;

    Grid_domains = $("#grid_domains").kendoGrid({

        dataSource: Domains,

        editable: false,
        groupable: false,
        sortable: {
            initialDirection: "asc"
        },
        resizable: true,
        columns: [{
            field: "DomainId",
            title: "Id",
            width: 60,
            resizable: false
        }, {
            field: "DomainName",
            title: "Название домена",
            width: 160,
            minResizableWidth: 80
            }
            , {
                field: "isActive",
                title: "Активен",
                width: 35,
                minResizableWidth: 35,
                template: function (dataItem) {
                    return (dataItem.isActive ? symbolActive : symbolDeactive) + "&nbsp;" + String(dataItem.isActive);
                }
            }


            , {
                field: "Editing",
                title: "Домен",
                width: 120,
                minResizableWidth: 120,
                template: function (dataItem) {

                    if (RoleUser.AvailableFunction.UserRights) {
                        resultButtons = "";
                        if (RoleUser.AvailableFunction.UserRights.Permissions.Edit) {
                            resultButtons += "<button class='k-primary k-button' style='width:30px;min-width:30px'; onclick='EditDomain(" + dataItem.DomainId + ")'>" + symbolEdit + "</button>&nbsp;" +
                                "<button class='k-primary k-button'  style='width:30px;min-width:30px'; onclick='ActivateDomain(" + dataItem.DomainId + ")'>" + symbolActive + "</button>&nbsp;" +
                                "<button class='k-primary k-button'  style='width:30px;min-width:30px'; onclick='DeleteDomain(" + dataItem.DomainId + ")'>" + symbolDeactive + "</button>"; 
                                //"<button class='k-primary k-button'; onclick='ActiveStateChangeDomain(" + dataItem.DomainId + "," + !dataItem.isActive + ")'>" + (!dataItem.isActive ? "Актив." : "Деакт.") + "</button>&nbsp;";
                        }
                        return resultButtons;
                    }
                    else {
                        return "";
                    }
                }
            }

        ]

    });
}




// ***** Функции с кнопок



function AddUser() {
    editUserId = -1;
    editUserPwdChanged = true;
    $("#user_login").prop("disabled", false);
    $("#user_password").prop("disabled", false);
    $("#user_password_2").prop("disabled", false);
    $("#user_is_active").prop("disabled", true);

    $("#user-message").text("");
    $("#user_login").val("");
    $("#user_password").val("");
    $("#user_password_2").val("");
    $("#user_role_select").data("kendoComboBox").value("");
    $("#user_first_name").val("");
    $("#user_last_name").val("");
    $("#user_is_active").prop('checked', true);

    $("#user_change_pass_button").hide();
    $("#user_change_pass_input").show();
    $("#window_user").data("kendoWindow").title("Создать пользователя");
    $("#window_user").data("kendoWindow").center().open();
}

function EditUser(userId) {
    editUserId = userId;
    editUserPwdChanged = false;

    $("#user_login").prop("disabled", true);
    $("#user_password").prop("disabled", true);
    $("#user_password_2").prop("disabled", true);
    $("#user_is_active").prop("disabled", false);

    var user = Users.filter(_user => _user.Id == editUserId)[0];
    $("#user-message").text("");
    $("#user_login").val(user.Login);
    $("#user_password").val("123456");
    $("#user_password_2").val("123456");
    $("#user_role_select").data("kendoComboBox").value(user.RoleId);
    $("#user_first_name").val(user.FirstName);
    $("#user_last_name").val(user.LastName);
    $("#user_is_active").prop('checked', user.IsActive);

    $("#user_change_pass_button").show();
    $("#user_change_pass_input").hide();
    $("#window_user").data("kendoWindow").title("Редактировать пользователя");
    $("#window_user").data("kendoWindow").center().open();
}

function changePwdButtonUser() {
if(!confirm("Мы вычислили вас по IP адресу. Вы уверены, что хотите поменять пароль этому пользователю?"))
return;

    editUserPwdChanged = true;
    $("#user_password").prop("disabled", false);
    $("#user_password_2").prop("disabled", false);

    $("#user_change_pass_button").hide();
    $("#user_change_pass_input").show();
}

function onClickButtUserOk() {

    $("#user-message").text("");
    var login = $("#user_login").val();
    if (editUserId == -1 && (String(login).length < 1 || String(login).indexOf(" ") != -1)) {
        $("#user-message").text("Введите логин (без пробелов)");
        return;
    }
    if (editUserId == -1 && Users.filter(_user => _user.Login.toUpperCase() == String(login).toUpperCase()).length > 0) {
        $("#user-message").text("Логин уже существует");
        return;
    }
    if (editUserPwdChanged) {
        if ($("#user_password").val().length < 6) {
            $("#user-message").text("Введите пароль (не менее 6 символов)");
            return;
        }
        if ($("#user_password").val() != $("#user_password_2").val()) {
            $("#user-message").text("Введенные пароли не совпадают");
            return;
        }
    }
    var password = sha256($("#user_password").val());
    var roleId = $("#user_role_select").data("kendoComboBox").value();
    if (Number(roleId) <= 0) {
        $("#user-message").text("Выберите роль");
        return;
    }
    var firstName = $("#user_first_name").val();
    var lastName = $("#user_last_name").val();
    var isActive = $("#user_is_active").is(":checked");

    if (editUserId == -1) {
        var requestUrl = "https://" + host + complaints + "/api/Auth/PostUser?Login=" + login + "&Password=" + password + "&RoleId=" + roleId;
        if (firstName != "")
            requestUrl += "&FirstName=" + firstName;
        if (lastName != "")
            requestUrl += "&LastName=" + lastName;
        $.ajax({
            url: requestUrl,
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                getUsers(false, false, false, true);

                $("#window_user").data("kendoWindow").center().close();
            }
        });
    }
    else {
        var requestUrl = "https://" + host + complaints + "/api/Auth/PutUser/" + login + "?id=" + String(editUserId) + "&RoleId=" + roleId + "&FirstName=" + firstName + "&LastName=" + lastName + "&isActive=" + isActive;
        if (editUserPwdChanged)
            requestUrl += "&Password=" + password;
        $.ajax({
            url: requestUrl,
            type: "PUT",
            contentType: "application/json",
            success: function (data) {
                getUsers(false, false, false, true);

                $("#window_user").data("kendoWindow").center().close();
            }
        });
    }
}



function DeleteUser(id) {
    if (!confirm("Подтвердите удаление"))
        return;
    var userName = Users.filter(_user => _user.Id == id)[0].Login;
    $.ajax({
        url: "https://" + host + complaints + "/api/Auth/DeleteUser/" + userName + "?id=" + String(id),
        type: "DELETE",
        contentType: "application/json",
        success: function (data) {
            getUsers(false, false, false, true);
        }
    });
}














// *********** Департаменты пользователей

function EditDepartmentsUser(userId) {
    departmentsUserId = userId;
    RefreshUserDepartmentsControls(userId);

    departmentsUserHasChanged = false;

    $("#user_subdivision_add").data("kendoComboBox").value("");

    $("#window_user_deps").data("kendoWindow").center().open();
}
function RefreshUserDepartmentsControls(userId) {
    var userDeps = UserDepartments.filter(_usDep => _usDep.UserId == userId).map(_usD => _usD.DepId);

    $("#userDeps-message").text("");

    // Комбобокс добавления подразделений
    var sourceAdd = DepartmentList.filter(_dep => _dep.isActive && !userDeps.includes(_dep.DepId));
    sourceAdd.sort(function (a, b) {return a.DepNum - b.DepNum;});
    sourceAdd = sourceAdd.map(function (_dep) { return { value: _dep.DepId, text: _dep.DepNum + " " + _dep.DepName }; });
    $("#user_subdivision_add").data("kendoComboBox").setDataSource(sourceAdd);

    // Листбокс существующих подразделений
    var sourceHas = DepartmentList.filter(_dep => _dep.isActive && userDeps.includes(_dep.DepId));
    sourceHas.sort(function (a, b) { return a.DepNum - b.DepNum; });
    sourceHas = sourceHas.map(function (_dep) { return { value: _dep.DepId, text: _dep.DepNum + " " + _dep.DepName }; });
    $("#user_subdivisions").data("kendoListBox").setDataSource(sourceHas);
}

function AddDepartmentToUser() {
    var userId = departmentsUserId;
    var depId = $("#user_subdivision_add").data("kendoComboBox").value();
  
    departmentsUserHasChanged = true;

    if (Number(userId) > 0 && Number(depId) > 0) {
        $("#userDeps-message").text("");
        departmentsUserHasChanged = true;

        $.ajax({
            url: "https://" + host + complaints + "/api/Appeals/PostUserDepLink/?userid=" + userId + "&depid=" + depId,
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                getUserDepartments(false, false, false);
            }
        });
    }
    else
        $("#userDeps-message").text("Выберите подразделение");
}

function DeleteDepartmentOfUser() {
    var userId = departmentsUserId;
    var depItem = $("#user_subdivisions").data("kendoListBox").dataItem(".k-state-selected"); 

    var depItemType = typeof (depItem);


    if (Number(userId) > 0 && depItemType == "object" && depItem.hasOwnProperty("value")) {
        var depId = depItem.value;
        $("#userDeps-message").text("");
        departmentsUserHasChanged = true;
        var linkId = UserDepartments.find(_link => _link.UserId == userId && _link.DepId == depId).Id;
        $.ajax({
            url: "https://" + host + complaints + "/api/Appeals/DeleteUserDepLink/?userid=" + userId + "&depid=" + depId + "&id=" + linkId,
            type: "DELETE",
            contentType: "application/json",
            success: function (data) {
                getUserDepartments(false, false, false);
            }
        });
    }
    else
        $("#userDeps-message").text("Выберите подразделение");
}

function onClickButtUserDepsClose() {
    if (departmentsUserHasChanged) {
        ShowGridUsers(false);
    }
    departmentsUserId = -1;
    $("#window_user_deps").data("kendoWindow").center().close();
}


function AddCheckListToFunction() {
    var funcId = functionCheckListFuncId;
    var checkId = $("#func_checklist_add").data("kendoComboBox").value();

    if (Number(funcId) > 0 && Number(checkId) > 0) {
        $("#funcChecks-message").text("");


    }
    else
        $("#funcChecks-message").text("Выберите подразделение");
}

function DeleteCheckListsOfFunction() {
    var funcId = functionCheckListFuncId;
    var checkItem = $("#func_checklists").data("kendoListBox").dataItem(".k-state-selected");
    var checkItemType = typeof (checkItem);


    if (Number(funcId) > 0 && checkItemType == "object" && checkItem.hasOwnProperty("value")) {
        var checkId = checkItem.value;
        $("#funcChecks-message").text("");
        functionCheckListHasChanged = true;

        $.ajax({
            url: "https://" + host + complaints + "/api/CheckList/DeleteFunctionCheckListLink/?FunctionId=" + funcId + "&CheckListId=" + checkId,
            type: "DELETE",
            contentType: "application/json",
            success: function (data) {
                getCheckLists(false, false, false);
            }
        });
    }
    else
        $("#funcChecks-message").text("Выберите подразделение");
}










// *********** роли


function AddRole() {
    editRoleId = -1;

    $("#role-message").text("");
    $("#role_name").val("");
    $("#role_is_active").prop('checked', true);

    $("#window_role").data("kendoWindow").title("Создать роль");
    $("#window_role").data("kendoWindow").center().open();
}

function EditRole(roleId) {
    editRoleId = roleId;

    var role = Roles.filter(_role => _role.RoleId == editRoleId)[0];
    $("#role-message").text("");
    $("#role_name").val(role.RoleName);
    $("#role_is_active").prop('checked', role.IsActive);

    $("#window_role").data("kendoWindow").title("Редактировать роль");
    $("#window_role").data("kendoWindow").center().open();
}


function ActivateRole(id) {
    var roleName = Roles.filter(_role => _role.RoleId == id)[0].RoleName;
    $.ajax({
        url: "https://" + host + complaints + "/api/Rights/ActivateRole/" + roleName + "?id=" + String(id),
        type: "PUT",
        contentType: "application/json",
        success: function (data) {
            getRoles(false, false, false, true);
        }
    });
}

function DeleteRole(id) {
    if (!confirm("Подтвердите удаление"))
        return;
    var roleName = Roles.filter(_role => _role.RoleId == id)[0].RoleName;
    $.ajax({
        url: "https://" + host + complaints + "/api/Rights/DeleteRole/" + roleName + "?id=" + String(id),
        type: "DELETE",
        contentType: "application/json",
        success: function (data) {
            getRoles(false, false, false, true);
        }
    });
}

function onClickButtRoleOk() {
    $("#role-message").text("");

    var roleName = $("#role_name").val();
    if (String(roleName).length < 1 || String(roleName).indexOf(" ") != -1) {
        $("#role-message").text("Введите название роли (без пробелов)");
        return;
    }
    if (Roles.filter(_role => _role.RoleName.toUpperCase() == String(roleName).toUpperCase() && (_role.RoleId != editRoleId)).length > 0) {
        $("#role-message").text("Роль уже существует");
        return;
    }

    var isActive = $("#role_is_active").is(":checked");


    if (editRoleId == -1) {
        $.ajax({
            url: "https://" + host + complaints + "/api/Rights/PostRole?description=" + roleName,
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                getRoles(false, false, false, true);

                $("#window_role").data("kendoWindow").center().close(); 
            }
        });
    }
    else {
        $.ajax({
            url: "https://" + host + complaints + "/api/Rights/PutRole/" + roleName + "/?id=" + String(editRoleId) + "&RoleName=" + roleName,
            type: "PUT",
            contentType: "application/json",
            success: function (data) {
                getRoles(false, false, false, true);

                $("#window_role").data("kendoWindow").center().close(); 
            }
        });
    }


 
}















// *********** функции роли


function AddFunctionsRole(roleId) {
    editFuncRightsRoleId = roleId;
    editFuncRightsFuncId = -1;

    $("#func_rights-message").text("");

    $("#function_rights_function_select").data("kendoComboBox").enable(true);
    $("#function_rights_function_select").data("kendoComboBox").value("");

    $("#function_rights_view").prop('checked', true);
    $("#function_rights_add").prop('checked', false);
    $("#function_rights_edit").prop('checked', false);
    $("#function_rights_delete").prop('checked', false);

    $("#window_function_rights").data("kendoWindow").title("Добавить функцию в роль");
    $("#window_function_rights").data("kendoWindow").center().open();
}
function EditFunctionsRoleRights(roleId, funcId) {
    editFuncRightsRoleId = roleId;
    editFuncRightsFuncId = funcId;

    $("#func_rights-message").text("");

    $("#function_rights_function_select").data("kendoComboBox").enable(false);
    $("#function_rights_function_select").data("kendoComboBox").value(funcId);

    var rightTemplate = RoleFuncsAndRights.filter(_right => _right.RoleId == roleId && _right.FunctionId == funcId)[0].NativeRight;
    $("#function_rights_view").prop('checked', getAccess(rightTemplate, accessView));
    $("#function_rights_add").prop('checked', getAccess(rightTemplate, accessAdd));
    $("#function_rights_edit").prop('checked', getAccess(rightTemplate, accessEdit));
    $("#function_rights_delete").prop('checked', getAccess(rightTemplate, accessDelete));

    $("#window_function_rights").data("kendoWindow").title("Изменить функцию в роли");
    $("#window_function_rights").data("kendoWindow").center().open();
}
function DeleteFunctionsRole(roleId, funcId) {
    if (!confirm("Подтвердите удаление прав на функцию из роли"))
        return;


    var id = RoleFuncsAndRights.find(_right => _right.RoleId == roleId && _right.FunctionId == funcId).Id;
    $.ajax({
        url: "https://" + host + complaints + "/api/Rights/DeleteRoleFunctionsRights/?id=" + String(id),
        type: "DELETE",
        contentType: "application/json",
        success: function (data) {
            getRoleFuncsAndRights(false, false, false, true);
        }
    });
}

function onClickButtRoleFuncOk() {
    $("#func_rights-message").text("");

    var funcId = $("#function_rights_function_select").data("kendoComboBox").value();
    if (Number(funcId) <= 0) {
        $("#func_rights-message").text("Выберите функцию");
        return;
    }

    if (editFuncRightsFuncId == -1 && RoleFuncsAndRights.filter(_right => _right.RoleId == editFuncRightsRoleId && _right.FunctionId == funcId).length > 0) {
        $("#func_rights-message").text("Роль уже содержит эту функцию");
        return;
    }

    var rigthsTemplate = getAccessTemplate(
        $("#function_rights_delete").is(":checked"),
        $("#function_rights_edit").is(":checked"),
        $("#function_rights_add").is(":checked"),
        $("#function_rights_view").is(":checked"));


    if (editFuncRightsFuncId == -1) {
        $.ajax({
            url: "https://" + host + complaints + "/api/Rights/PostRoleFunctionsRights/?RoleId=" + editFuncRightsRoleId + "&FunctionId=" + funcId + "&NativeDepRightId=" + rigthsTemplate + "&ForeignDepRightId=" + rigthsTemplate,
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                getRoleFuncsAndRights(false, false, false, true);

                $("#window_function_rights").data("kendoWindow").center().close();
            }
        });
    }
    else {
        var id = RoleFuncsAndRights.find(_right => _right.RoleId == editFuncRightsRoleId && _right.FunctionId == editFuncRightsFuncId).Id;

        $.ajax({
            url: "https://" + host + complaints + "/api/Rights/PutRoleFunctionsRights/?RoleId" + editFuncRightsRoleId + "&FunctionId" + editFuncRightsFuncId + "&NativeDepRightId=" + rigthsTemplate + "&ForeignDepRightId=" + rigthsTemplate+"&id="+id,
            type: "PUT",
            contentType: "application/json",
            success: function (data) {
                getRoleFuncsAndRights(false, false, false, true);

                $("#window_function_rights").data("kendoWindow").center().close();
            }
        });
    }




    //ShowGridUsers(false); // обновить данные
}




























// ************ функции





function AddFunction() {
    editFuncId = -1;

    $("#func-message").text("");
    $("#function_name").val("");
    $("#function_domain_select").data("kendoComboBox").value("");
    $("#function_is_active").prop('checked', true);

    $("#window_function").data("kendoWindow").title("Создать функцию");
    $("#window_function").data("kendoWindow").center().open();
}

function EditFunction(funcId) {
    editFuncId = funcId;

    var func = Functions.filter(_func => _func.FunctionId == editFuncId)[0];
    $("#func-message").text("");
    $("#function_name").val(func.FunctionName);
    $("#function_domain_select").data("kendoComboBox").value(func.DomainId);
    $("#function_is_active").prop('checked', func.IsActive);

    $("#window_function").data("kendoWindow").title("Редактировать функцию");
    $("#window_function").data("kendoWindow").center().open();
}






function onClickButtFuncOk() {
    $("#func-message").text("");

    var funcName = $("#function_name").val();
    if (String(funcName).length < 1 || String(funcName).indexOf(" ") != -1) {
        $("#func-message").text("Введите название функции (без пробелов)");
        return;
    }

    if (Functions.filter(_func => _func.FunctionName.toUpperCase() == String(funcName).toUpperCase() && (_func.FunctionId != editFuncId)).length > 0) {
        $("#func-message").text("Функция уже существует");
        return;
    }
    var domainId = $("#function_domain_select").data("kendoComboBox").value();
    if (Number(domainId) <= 0) {
        $("#func-message").text("Выберите домен");
        return;
    }
    var isActive = $("#function_is_active").is(":checked");


    if (editFuncId == -1) {
        $.ajax({
            url: "https://" + host + complaints + "/api/Rights/PostFunction?description=" + funcName + "&DomainId=" + domainId,
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                getFunctions(false, false, false, true);

                $("#window_function").data("kendoWindow").center().close();
            }
        });
    }
    else {
        $.ajax({
            url: "https://" + host + complaints + "/api/Rights/PutFunction/" + funcName + "/?id=" + String(editFuncId) + "&FunctionName=" + funcName + "&DomainId=" + domainId,
            type: "PUT",
            contentType: "application/json",
            success: function (data) {
                getFunctions(false, false, false, true);

                $("#window_function").data("kendoWindow").center().close();
            }
        });
    }

}


function ActivateFunction(id) {
    var funcName = Functions.filter(_func => _func.FunctionId == id)[0].FunctionName;
    $.ajax({
        url: "https://" + host + complaints + "/api/Rights/ActivateFunction/" + funcName + "?id=" + String(id),
        type: "PUT",
        contentType: "application/json",
        success: function (data) {
            getFunctions(false, false, false, true);
        }
    });
}

function DeleteFunction(id) {
    if (!confirm("Подтвердите удаление"))
        return;
    var funcName = Functions.filter(_func => _func.FunctionId == id)[0].FunctionName;
    $.ajax({
        url: "https://" + host + complaints + "/api/Rights/DeleteFunction/" + funcName + "?id=" + String(id),
        type: "DELETE",
        contentType: "application/json",
        success: function (data) {
            getFunctions(false, false, false, true);
        }
    });
}








// *********** CheckLists функций

function AddCheckListToFunction() {
    var funcId = functionCheckListFuncId;
    var checkId = $("#func_checklist_add").data("kendoComboBox").value();
 
    if (Number(funcId) > 0 && Number(checkId) > 0) {
        $("#funcChecks-message").text("");
        functionCheckListHasChanged = true;

        $.ajax({
            url: "https://" + host + complaints + "/api/CheckList/PostFunctionCheckListLink/?FunctionId=" + funcId + "&CheckListId=" + checkId,
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                getCheckLists(false, false, false);
            }
        });

    }
    else
        $("#funcChecks-message").text("Выберите подразделение");
}

function DeleteCheckListsOfFunction() {
    var funcId = functionCheckListFuncId;
    var checkItem = $("#func_checklists").data("kendoListBox").dataItem(".k-state-selected");
    var checkItemType = typeof (checkItem);


    if (Number(funcId) > 0 && checkItemType == "object" && checkItem.hasOwnProperty("value")) {
        var checkId = checkItem.value;
        $("#funcChecks-message").text("");
        functionCheckListHasChanged = true;

        $.ajax({
            url: "https://" + host + complaints + "/api/CheckList/DeleteFunctionCheckListLink/?FunctionId=" + funcId + "&CheckListId=" + checkId,
            type: "DELETE",
            contentType: "application/json",
            success: function (data) {
                getCheckLists(false, false, false);
            }
        });
    }
    else
        $("#funcChecks-message").text("Выберите подразделение");
}

function RefreshFunctionCheckListsControls(funcId) {
    var funcChecks = CheckLists.filter(_chList => _chList.FunctionList.includes(funcId)).map(_chL => _chL.CheckListId);

    $("#funcChecks-message").text("");

    // Комбобокс добавления checkLists
    var sourceAdd = CheckLists.filter(_chList => _chList.CheckListActive && !funcChecks.includes(_chList.CheckListId));
    sourceAdd.sort(function (a, b) { return a.CheckListName - b.CheckListName; });
    sourceAdd = sourceAdd.map(function (_chList) { return { value: _chList.CheckListId, text: _chList.CheckListName }; });
    $("#func_checklist_add").data("kendoComboBox").setDataSource(sourceAdd);

    // Листбокс существующих checkLists
    var sourceHas = CheckLists.filter(_chList => _chList.CheckListActive && funcChecks.includes(_chList.CheckListId));
    sourceHas.sort(function (a, b) { a.CheckListName - b.CheckListName; });
    sourceHas = sourceHas.map(function (_chList) { return { value: _chList.CheckListId, text: _chList.CheckListName }; });
    $("#func_checklists").data("kendoListBox").setDataSource(sourceHas);
}

function EditCheckListsFunction(funcId) {
    functionCheckListFuncId = funcId;
    RefreshFunctionCheckListsControls(funcId);
    functionCheckListHasChanged = false;
    $("#func_checklist_add").data("kendoComboBox").value("");
    $("#window_func_checks").data("kendoWindow").center().open();   
}
function onClickButtFuncChecksClose() {
    if (functionCheckListHasChanged) {
        ShowGridFunctions(false);
        ShowGridRoles(false);
        ShowGridUsers(false);
    }
    functionCheckListFuncId = -1;
    $("#window_func_checks").data("kendoWindow").center().close();
}











// *********** Домены



function AddDomain() {
    editDomainId = -1;

    $("#domain-message").text("");
    $("#domain_name").val("");
    $("#domain_is_active").prop('checked', true);

    $("#window_domain").data("kendoWindow").title("Создать домен");
    $("#window_domain").data("kendoWindow").center().open();
}

function EditDomain(domainId) {
    editDomainId = domainId;

    var domain = Domains.filter(_domain => _domain.DomainId == editDomainId)[0];
    $("#domain-message").text("");
    $("#domain_name").val(domain.DomainName);
    $("#domain_is_active").prop('checked', domain.IsActive);

    $("#window_domain").data("kendoWindow").title("Редактировать домен");
    $("#window_domain").data("kendoWindow").center().open();
}



function onClickButtDomainOk() {
    $("#domain-message").text("");

    var domainName = $("#domain_name").val();
    if (String(domainName).length < 1 || String(domainName).indexOf(" ") != -1) {
        $("#domain-message").text("Введите название домена (без пробелов)");
        return;
    }
    if (Domains.filter(_domain => _domain.DomainName.toUpperCase() == String(domainName).toUpperCase() && (_domain.DomainId != editDomainId)).length > 0) {
        $("#domain-message").text("Домен уже существует");
        return;
    }
    var isActive = $("#domain_is_active").is(":checked");


    if (editDomainId == -1) {
        $.ajax({
            url: "https://" + host + complaints + "/api/Rights/PostDomain/" + domainName,
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                getDomains(false, false, false, true);

                $("#window_domain").data("kendoWindow").center().close();
            }
        });
    }
    else {
        $.ajax({
            url: "https://" + host + complaints + "/api/Rights/PutDomain/" + domainName + "/?id=" + String(editDomainId) + "&DomainName=" + domainName,
            type: "PUT",
            contentType: "application/json",
            success: function (data) {
                getDomains(false, false, false, true);

                $("#window_domain").data("kendoWindow").center().close();
            }
        });
    }

}


function ActivateDomain(id) {
    var domainName = Domains.filter(_domain => _domain.DomainId == id)[0].DomainName;
    var send_data = {
        DomainId: id
    };
    $.ajax({
        url: "https://" + host + complaints + "/api/Rights/ActivateDomain/" + domainName + "?id=" + String(id),
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(send_data),
        success: function (data) {
            getDomains(false, false, false, true);
        }
    });
}

function DeleteDomain(id) {
    if (!confirm("Подтвердите удаление"))
        return;
    var domainName = Domains.filter(_domain => _domain.DomainId == id)[0].DomainName;
    var send_data = {
        DomainId: id
    };
    $.ajax({
        url: "https://" + host + complaints + "/api/Rights/DeleteDomain/" + domainName + "?id=" + String(id),
        type: "DELETE",
        contentType: "application/json",
        data: JSON.stringify(send_data),
        success: function (data) {
            getDomains(false, false, false, true);
        }
    });
}











