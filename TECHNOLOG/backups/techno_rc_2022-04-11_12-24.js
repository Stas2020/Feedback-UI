
var DepartmentList = [];
var UserDepLinks = [];
var userFunctionId;
var CodProvs = [];
var CassGroups = [];

var ajax_count = 0;

var symbolEdit = "✎";//"🖍 ✎";
var symbolFunc = "ƒ";
var symbolPlus = "➕";
var symbolPlusSmall = "+";
var symbolDelete = "🗑";//"🗑 🧺";
var symbolView = "👁";//👁" 👀";

var symbolActive = "✔";//"✓";//"☑";
var symbolDeactive = "❌";//"☐";

var Mnu = [];
var Dims = [];

var Grid_RecipeChanges;

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
                


        $("#button_recipe_changes_refresh").kendoButton({ click: RefreshAll });

        var _today = new Date();
        var _priorDate = new Date(new Date().setDate(_today.getDate()));

        $("#datepickerstart_recipe_changes").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerend_recipe_changes").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerstart_recipe_changes").data("kendoDatePicker").value(_priorDate);
        $("#datepickerend_recipe_changes").data("kendoDatePicker").value(_today);

        $("#datepickerstart_prih").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerend_prih").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerstart_prih").data("kendoDatePicker").value(_priorDate);
        $("#datepickerend_prih").data("kendoDatePicker").value(_today);

        $("#datepickerstart_prorab").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerend_prorab").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerstart_prorab").data("kendoDatePicker").value(_priorDate);
        $("#datepickerend_prorab").data("kendoDatePicker").value(_today);

        $("#datepickerstart_proizv").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerend_proizv").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerstart_proizv").data("kendoDatePicker").value(_priorDate);
        $("#datepickerend_proizv").data("kendoDatePicker").value(_today);

        $("#datepickerstart_spis").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerend_spis").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerstart_spis").data("kendoDatePicker").value(_priorDate);
        $("#datepickerend_spis").data("kendoDatePicker").value(_today);

      

        $("#recipe_changes_deps").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#prih_deps").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#prorab_deps").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#proizv_deps").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#forecast_dim").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#spis_deps").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#spis_provs").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#prorab_barcode_mode").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        var barModes = [];
        barModes.push({ text: "Вход и выход", value : 0 });
        barModes.push({ text: "Вход", value : 1 });
        barModes.push({ text: "Выход", value : 2 });
        $("#prorab_barcode_mode").data("kendoComboBox").setDataSource(barModes);






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


        
        var window_technology = $("#window_technology")
        window_technology.kendoWindow({
            actions: ["Close"],
            width: "800px",
            height: "800px",
            modal: true,
            resizable: false,
            title: "Технология",
            visible: false,
            sizable: true,
            //open: adjustSize,
            adjustSize: {
                width: 600,
                height: 800
            }
        });

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
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
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

                        userFunctionId = item.Function.FunctionId;


                        var Permissions = new Object();
                        Permissions.Edit = item.NativeRight.Edit;
                        Permissions.Delete = item.NativeRight.Delete;
                        Permissions.Add = item.NativeRight.Add;
                        Permissions.View = item.NativeRight.View;

                        Function.Permissions = Permissions;

                        RoleUser.AvailableFunction[item.Function.FunctionName] = Function;

                    });

                    $("#context-menu-prtype").kendoContextMenu({
                        target: "#setPrType"
                    });
                    var contextMenu = $("#context-menu-prtype").data("kendoContextMenu");
                    contextMenu.bind("open", function (e) {
                    });

                    if (data.FuncList.filter(_f => _f.Function.FunctionId == 2013).length == 0) {
                        $("#setPrType").remove();
                        $("#tab_food_prtype").remove();
                    }

                    if (data.FuncList.filter(_f => _f.Function.FunctionId == 2011).length == 0) {
                        $("#tab_vol_forecast").remove();
                    }

                    if (data.FuncList.filter(_f => _f.Function.FunctionId == 2012).length == 0) {
                        $("#tab_food_prih").remove();
                        $("#tab_food_prorab").remove();
                        $("#tab_food_proizv").remove();
                        $("#tab_food_spis").remove();
                    }

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

    Mnu = [];
    Dims = [];

    $("#window_login").data("kendoWindow").center().open();
    $("#tools_users").css("display", "none");
    $("#tools_roles").css("display", "none");
    $("#tools_functions").css("display", "none");
    $("#tools_domains").css("display", "none");
    $("#tabs").css("display", "none");
    $("#tab-content").css("display", "none");

    $("#grid_recipe_changes").data("kendoGrid").destroy();
    $("#recipe_changes_deps").data("kendoComboBox").destroy();
    $("#prih_deps").data("kendoComboBox").destroy();
    $("#prorab_deps").data("kendoComboBox").destroy();
    $("#prorab_barcode_mode").data("kendoComboBox").destroy();
    $("#proizv_deps").data("kendoComboBox").destroy();
    $("#spis_deps").data("kendoComboBox").destroy(); 
    $("#forecast_dim").data("kendoComboBox").destroy();
    $("#forecast_calc_recipe_mode").data("kendoComboBox").destroy();
    //$("#forecast_deps").data("kendoComboBox").destroy();
    $("#datepickerstart_recipe_changes").data("kendoDatePicker").destroy();
    $("#datepickerend_recipe_changes").data("kendoDatePicker").destroy();
    $("#datepickerstart_prih").data("kendoDatePicker").destroy();
    $("#datepickerend_prih").data("kendoDatePicker").destroy();
    $("#datepickerstart_prorab").data("kendoDatePicker").destroy();
    $("#datepickerend_prorab").data("kendoDatePicker").destroy();
    $("#datepickerstart_proizv").data("kendoDatePicker").destroy();
    $("#datepickerend_proizv").data("kendoDatePicker").destroy();
    $("#datepickerstart_spis").data("kendoDatePicker").destroy();
    $("#datepickerend_spis").data("kendoDatePicker").destroy();
    $("#datepicker_forecast").data("kendoDatePicker").destroy();
    $("#datepicker_forecast_dim").data("kendoDatePicker").destroy();

    var grid_technology = $("#grid_technology").data("kendoGrid");
    if (grid_technology) {
        grid_technology.destroy();
    }
    var grid_prtype = $("#grid_prtype").data("kendoGrid");
    if (grid_prtype) {
        grid_prtype.destroy();
    }
    $("#grid_prih").data("kendoGrid").destroy();
    $("#grid_prorab").data("kendoGrid").destroy();
    $("#grid_proizv").data("kendoGrid").destroy();
    $("#grid_forecast").data("kendoGrid").destroy();
    $("#grid_spis").data("kendoGrid").destroy();

    var comboProv = $("#spis_prov").data("kendoComboBox");
    if (comboProv) {
        comboProv.destroy();
    }

}





// ***** Получение данных

function RefreshAll() {
    getAllData(false, true);
}

function getAllData(_initTable, _refreshTable) {
    getDepartments(true, _initTable, _refreshTable);
}

function getUserDepLinks(_executeChain, _initTable, _refreshTable, _refreshAllTables = false) {
    $.ajax({
        url: "https://s2010/complaints/api/info/GetUserDepLinks",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {
                // user_id
                UserDepLinks = [];
                data.forEach(function (item) {
                    if (item.UserId == user_id) {
                        var nowDep = DepartmentList.find(dep => Number(dep.DepId) == Number(item.DepId));
                        UserDepLinks.push(nowDep.DepNum);
                    }
                });

                var deps = DepartmentList.filter(_dep => _dep.isActive);
                if (UserDepLinks.length > 0)
                    deps = deps.filter(_dep => UserDepLinks.indexOf(_dep.DepNum) != -1)
                deps.sort(function (a, b) { return a.DepNum - b.DepNum; });
                deps = deps.map(function (_dep) { return { value: _dep.DepNum, text: String(_dep.DepNum) + " " + _dep.DepName }; });

                if (UserDepLinks.length > 0) {
                    var comboBox = $("#recipe_changes_deps").data("kendoComboBox");
                    $(comboBox.input).attr('placeholder', deps[0].text);
                    //$('#recipe_changes_deps').attr('placeholder', deps[0].text);
                }
                else {
                    deps.unshift({ value: 88, text: "88 Школа поваров" });
                    deps.unshift({ value: "ALL", text: "Все подразделения" });
                }

                $("#recipe_changes_deps").data("kendoComboBox").setDataSource(deps);

                $("#prih_deps").data("kendoComboBox").setDataSource(deps);
                $("#prorab_deps").data("kendoComboBox").setDataSource(deps);
                $("#proizv_deps").data("kendoComboBox").setDataSource(deps);
                $("#spis_deps").data("kendoComboBox").setDataSource(deps);

                //$("#forecast_deps").data("kendoComboBox").setDataSource(depsWAC);
                

                if ($("#tab_food_spis"))
                getCodProvs(true, _initTable, _refreshTable);
                    else
                RefreshRecipeChanges();
            }
        }
    });
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
                getUserDepLinks(true, _initTable, _refreshTable);
            } else {
                onExit();
            }
        }
    });
}


function getCodProvs(_executeChain, _initTable, _refreshTable, _refreshAllTables = false) {
    $.ajax({
        url: "https://" + host + complaints + "/api/Info/GetWriteoffReasons",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {
                CodProvs = []
                data.forEach(function (item) {
                    CodProvs.push(item);
                });
                var reas = CodProvs.map(function (_reas) { return { value: _reas.Cod, text: _reas.Name }; });
                reas.unshift({ value: "ALL", text: "Все причины" });
                $("#spis_provs").data("kendoComboBox").setDataSource(reas);
            } else {
                onExit();
            }
        }
    });
}

// ***** Отрисовка гридов


function RefreshRecipeChanges() {

    var startDate = $("#datepickerstart_recipe_changes").data("kendoDatePicker").value();
    var endDate = $("#datepickerend_recipe_changes").data("kendoDatePicker").value();
    var diff = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24);

    var maxDiff = (userFunctionId == 2009 ? 3 : 31)


    var grid = $("#grid_recipe_changes").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_recipe_changes").remove();

    var SD = $("#datepickerstart_recipe_changes").val().split('/');
    var ED = $("#datepickerend_recipe_changes").val().split('/');


    var FStartDate = SD[2] + SD[1] + SD[0];
    var FEndDate = ED[2] + ED[1] + ED[0];

    var filtersGet = "FStartDate=" + FStartDate + "&FEndDate=" + FEndDate;

    var barCode = $("#recipe_changes_barcode").val();
    if (barCode != "")
        filtersGet += "&CodGood=" + barCode;

    if (diff > maxDiff && barCode == "") {
        alert("Пока доступна выборка не более чем за " + String(maxDiff) + " дн.");
        return;
    }

    var depId = $("#recipe_changes_deps").data("kendoComboBox").value();
    if (depId != "" && depId != "ALL")
        filtersGet += "&CodShop=" + depId;
    else {
        if (UserDepLinks.length > 0) {
            var comboBox = $("#recipe_changes_deps").data("kendoComboBox");
            comboBox.select(0);
            depId = $("#recipe_changes_deps").data("kendoComboBox").value();
            filtersGet += "&CodShop=" + depId;
        }
    }


    WaitShow("recipe_changes");

    $.ajax({
        url: "https://s2010/complaints/api/info/GetRecipeChanges?" + filtersGet,
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("recipe_changes", null);
            if (typeof (data) == "object") {
                PrepareData(data)
            };
        },
        error: function () {
            WaitHide("recipe_changes", "Произошла ошибка при загрузке списка изменений техкарт");
        }
    })


}


function PrepareData(data) {
    var data_source = [];


    var filterUser = $("#recipe_changes_user").val().toLowerCase();

    var cnt = 0;

    data.forEach(function (item, idx) {
        if (filterUser == "" || (filterUser != "" && (item["Work"].toLowerCase().indexOf(filterUser) != -1 || item["Acceptor"].toLowerCase().indexOf(filterUser) != -1))) {
            var obj = new Object();
            obj["LocCode"] = item["LocCode"];
            obj["Name"] = item["Name"];
            obj["NumAkt"] = item["NumAkt"];
            obj["Description"] = item["Description"];
            obj["Work"] = item["Work"];
            obj["Acceptor"] = item["Acceptor"];
            obj["DateCalc"] = item["DateCalc"];
            obj["DateChanges"] = item["DateChanges"];
            obj["DateWork"] = item["DateWork"];
            data_source.push(obj);
            cnt++;
        }
    });

    $("#recipe_changes_cnt").val(cnt);

    function excelexport(e) {
        var colFormats = [];
        $("#grid_recipe_changes").data("kendoGrid").columns.forEach(_col => {
            try {
                if (_col.format != null) colFormats[_col.title] = _col.format.split(":")[1].replace("}", "");
            } catch { }
        })

        var sheet = e.workbook.sheets[0];

        var row0 = sheet.rows[0];
        for (var cellIndex = 1/*0*/; cellIndex < row0.cells.length; cellIndex++) {
            sheet.columns[cellIndex].width = 105;
            sheet.columns[cellIndex].autoWidth = false;
            var cell = row0.cells[cellIndex];
            cell.wrap = true;
            cell.verticalAlign = "top";
        }
        var cell0 = row0.cells[0];
        cell0.verticalAlign = "top";
        for (var rowIndex = 1/*0*/; rowIndex < sheet.rows.length; rowIndex++) {
            var row = sheet.rows[rowIndex];
            row.cells[0].value = kendo.parseDate(row.cells[0].value, 'yyyy-MM-ddTHH:mm:ss');
            row.cells[0].format = "dd.MM.yyyy HH:mm";
            row.cells[2].value = kendo.parseDate(row.cells[2].value, 'yyyy-MM-ddTHH:mm:ss');
        }
    }

    $("#box_recipe_changes").append("<div id='grid_recipe_changes'></div>");
    $("#grid_recipe_changes").kendoGrid({
        toolbar: ["excel"],
        excelExport: excelexport,
        excel: {
            allPages: true,
            fileName: "TechnoChanges.xlsx"
        },
        columns: [{
            field: "DateChanges",
            title: "ДАТА ИЗМЕНЕНИЯ!",
            width: "150px",
            template: function (dataItem) {
                return "<b>" + kendo.toString(kendo.parseDate(dataItem.DateChanges, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy HH:mm') + "</b>";
            }
        }, {
            field: "NumAkt",
            title: "Номер калькуляции",
                width: "110px",
                template: function (dataItem) {
                    return "<b>" + String(dataItem.NumAkt) + "</b>";
                }
        }, {
            field: "DateWork",
            title: "Дата привязки",
            width: "130px",
            template: function (dataItem) {
                return kendo.toString(kendo.parseDate(dataItem.DateWork, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "</b>";
            }
        }, {
            field: "LocCode",
            title: "Баркод",
                width: "100px",
                template: function (dataItem) {
                    return "<b>" + String(dataItem.LocCode) + "</b>";
                }
        }, {
            field: "Name",
            title: "Название",
                width: "230px",
                template: function (dataItem) {
                    return "<b>" + dataItem.Name + "</b>";
                }
            },
            {
                field: "Description",
                title: "Описание изменений"
            },
            {
                field: "Work",
                title: "Автор карты (Work)",
                width: "130px"
            },
            {
                field: "Acceptor",
                title: "Пользователь (Acceptor)",
                width: "280px"
            },   {
                field: "Show",
                title: symbolView + symbolView,//"☥",
                width: "65px",
                template: function (dataItem) {
                    return "<button style='width:35px; min-width:35px;' class='k-primary k-button'; onclick='ShowCalculation(" + dataItem.LocCode + "," + dataItem.NumAkt + ",\x22" + dataItem.Work + "\x22)'>" + symbolView + "</button>";
                }
            }],
        sortable: true,
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source
    });

    $("#grid_recipe_changes").data("kendoGrid").dataSource.sort({ field: "DateChanges", dir: "asc" });
    $("#grid_recipe_changes").data("kendoGrid").dataSource.read();
}


function ShowCalculation(barCode, numAkt, author) {
    var grid = $("#grid_technology").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_technology").remove();

    $.ajax({
        url: "https://s2010/complaints/api/info/GetRecipe?CodGood=" + barCode + "&NumAkt=" + numAkt,
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {
                PrepareCalsData(data, author)
            };
        }
    })


}

function PrepareCalsData(data, author) 
{

        var data_source = [];

        data.Rows.forEach(function (item, idx) {

            var obj = new Object();
            obj["LocCode"] = item.LocCode;
            obj["Name"] = item.Name;
            obj["QuanBrutto"] = item.QuanBrutto;
            obj["QuanNetto"] = item.QuanNetto;
            obj["Unit"] = item.Unit;
            data_source.push(obj);
        });

    $("#technology_name").val(String(data.LocCode) + " - " + data.Name);
    $("#technology_quant").val(data.Quant);
    $("#technology_calc_num").val(data.NumAkt);
    $("#technology_description").val(data.Description);
    $("#technology_author").val(author);
    $("#technology_text").val(data.TechCard); 
    $("#technology_workdate").val(kendo.toString(kendo.parseDate(data.DateWork, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy'));

        $("#box_technology").append("<div id='grid_technology'></div>");
        $("#grid_technology").kendoGrid({
            /*toolbar: ["excel"],*/
            columns: [{
                field: "LocCode",
                title: "Баркод",
                width: "100px"
            }, {
                    field: "Name",
                    title: "Название"
                }, {
                    field: "QuanBrutto",
                    title: "Брутто",
                    width: "70px"
                }, {
                    field: "QuanNetto",
                    title: "Нетто",
                    width: "70px"
                }, {
                    field: "Unit",
                    title: "Ед.изм.",
                    width: "70px"
                }],
            sortable: true,
            height: 405,
            resizable: true,
            navigatable: true,
            dataSource: data_source
        });

        $("#grid_technology").data("kendoGrid").dataSource.sort({ field: "field0", dir: "asc" });
        $("#grid_technology").data("kendoGrid").dataSource.read();

    $("#window_technology").data("kendoWindow").center().open();
}



////////////////////////////////////////////////////////////////////////////////// prih



function RefreshPrih() {

    var startDate = $("#datepickerstart_prih").data("kendoDatePicker").value();
    var endDate = $("#datepickerend_prih").data("kendoDatePicker").value();
    var diff = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24);

    var maxDiff = (userFunctionId == 2009 ? 3 : 31)

    if (diff > maxDiff) {
        alert("Пока доступна выборка не более чем за " + String(maxDiff) + " дн.");
        return;
    }

    var grid = $("#grid_prih").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_prih").remove();

    var SD = $("#datepickerstart_prih").val().split('/');
    var ED = $("#datepickerend_prih").val().split('/');


    var FStartDate = SD[2] + SD[1] + SD[0];
    var FEndDate = ED[2] + ED[1] + ED[0];

    var filtersGet = "FStartDate=" + FStartDate + "&FEndDate=" + FEndDate;

    var depId = $("#prih_deps").data("kendoComboBox").value();
    if (depId != "" && depId != "ALL")
        filtersGet += "&CodShop=" + depId;
    else {
        if (UserDepLinks.length > 0) {
            var comboBox = $("#prih_deps").data("kendoComboBox");
            comboBox.select(0);
            depId = $("#prih_deps").data("kendoComboBox").value();
            filtersGet += "&CodShop=" + depId;
        }
    }

    var barCode = $("#prih_barcode").val();
    if (!isNaN(parseInt(barCode)))
        filtersGet += "&CodGood=" + barCode;
    else {
        alert("Введите баркод");
        return;
    }

    WaitShow("prih");

    $.ajax({
        url: "https://s2010/complaints/api/info/GetIncomingInvoices?" + filtersGet,
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("prih", null);
            if (typeof (data) == "object") {
                PrepareDataPrih(data)
            };
        },
        error: function () {
            WaitHide("prih", "Произошла ошибка при загрузке списка приходных накладных");
        }
    })


}


function PrepareDataPrih(data) {
    var data_source = [];



    var cnt = 0;
    var cnt_pr = 0;

    data.forEach(function (item, idx) {
            var obj = new Object();
        obj["CodShop"] = item["CodShop"];
        obj["CostPrice"] = item["CostPrice"];
        obj["DateAkt"] = item["DateAkt"];
        obj["NumAkt"] = item["NumAkt"];
        obj["Operator"] = item["Operator"];
        obj["QuanFact"] = item["QuanFact"];
        obj["Supp"] = item["Supp"];
        obj["CodGood"] = item["CodGood"];
        obj["NameGood"] = item["NameGood"];
            data_source.push(obj);
        cnt++;
        if (!isNaN(item["QuanFact"]))
            cnt_pr += item["QuanFact"];
    });
    
    $("#prih_cnt").val(cnt);
    $("#prih_prod_cnt").val(cnt_pr);

    function excelexport(e) {
        var colFormats = [];
        $("#grid_prih").data("kendoGrid").columns.forEach(_col => {
            try {
                if (_col.format != null) colFormats[_col.title] = _col.format.split(":")[1].replace("}", "");
            } catch { }
        })

        var sheet = e.workbook.sheets[0];

        var row0 = sheet.rows[0];
        for (var cellIndex = 1/*0*/; cellIndex < row0.cells.length; cellIndex++) {
            sheet.columns[cellIndex].width = 105;
            sheet.columns[cellIndex].autoWidth = false;
            var cell = row0.cells[cellIndex];
            cell.wrap = true;
            cell.verticalAlign = "top";
        }
        var cell0 = row0.cells[0];
        cell0.verticalAlign = "top";

        //
        for (var rowIndex = 1/*0*/; rowIndex < sheet.rows.length; rowIndex++) {
            var row = sheet.rows[rowIndex];
            row.cells[0].value = kendo.parseDate(row.cells[0].value, 'yyyy-MM-ddTHH:mm:ss');
        }
    }

    $("#box_prih").append("<div id='grid_prih'></div>");
    $("#grid_prih").kendoGrid({
        toolbar: ["excel"],
        excelExport: excelexport,
        excel: {
            allPages: true,
            fileName: "IncomingInvoices.xlsx"
        },
        columns: [{
            field: "DateAkt",
            title: "Дата накладной",
            width: "150px",
            template: function (dataItem) {
                return "<b>" + kendo.toString(kendo.parseDate(dataItem.DateAkt, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "</b>";//ShowCalculation(barCode, numAkt)
            }
        }, {
            field: "NumAkt",
            title: "Номер накладной",
            width: "110px",
            template: function (dataItem) {
                return "<b>" + String(dataItem.NumAkt) + "</b>";// + " от " + kendo.toString(kendo.parseDate(dataItem.DateCalc, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "</b>";
            }
            },
            {
                field: "Supp",
            title: "Поставщик"
            },
            {
                field: "CodGood",
                title: "Баркод",
                width: "120px"
            },
            {
                field: "NameGood",
                title: "Название",
                width: "150px"
            },
            {
                field: "QuanFact",
            title: "Кол-во факт",
            width: "70px"
        },
        {
            field: "CostPrice",
            title: "Цена (контракт)",
            width: "130px"
        },
        {
            field: "Operator",
            title: "Оператор",
            width: "280px"
        }, {
            field: "Show",
            title: symbolView + symbolView,//"☥",
            width: "65px",
            template: function (dataItem) {
                return "<button style='width:35px; min-width:35px;' class='k-primary k-button'; onclick='ShowCalculation(" + dataItem.LocCode + "," + dataItem.NumAkt + ",\x22" + dataItem.Work + "\x22)'>" + symbolView + "</button>";
            }
        }],
        sortable: true,
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source
    });

    $("#grid_prih").data("kendoGrid").dataSource.sort({ field: "DateAkt", dir: "asc" });
    $("#grid_prih").data("kendoGrid").dataSource.read();
}




function RefreshSpis() {

    var startDate = $("#datepickerstart_spis").data("kendoDatePicker").value();
    var endDate = $("#datepickerend_spis").data("kendoDatePicker").value();
    var diff = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24);

    var maxDiff = (userFunctionId == 2009 ? 3 : 31)

    if (diff > maxDiff) {
        alert("Пока доступна выборка не более чем за " + String(maxDiff) + " дн.");
        return;
    }

    var grid = $("#grid_spis").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_spis").remove();

    var SD = $("#datepickerstart_spis").val().split('/');
    var ED = $("#datepickerend_spis").val().split('/');


    var FStartDate = SD[2] + SD[1] + SD[0];
    var FEndDate = ED[2] + ED[1] + ED[0];

    var filtersGet = "FStartDate=" + FStartDate + "&FEndDate=" + FEndDate;

    var hasDep = true;
    var hasBarCode = true;
    var hasReason = true;

    var depId = $("#spis_deps").data("kendoComboBox").value();
    if (depId != "" && depId != "ALL")
        filtersGet += "&CodShop=" + depId;
    else {
        hasDep = false;
        //// Убрать возможность смотреть за все подразделения !!!
        //if (UserDepLinks.length > 0) {
        //    var comboBox = $("#spis_deps").data("kendoComboBox");
        //    comboBox.select(0);
        //    depId = $("#spis_deps").data("kendoComboBox").value();
        //    filtersGet += "&CodShop=" + depId;
        //} 147102
    }

    var reasId = $("#spis_provs").data("kendoComboBox").value();
    if (reasId != "" && reasId != "ALL")
        filtersGet += "&CodProv=" + reasId;
    else {
        hasReason = false;
    }

    var barCode = $("#spis_barcode").val();
    if (!isNaN(parseInt(barCode)))
        filtersGet += "&CodGood=" + barCode;
    else
    {
        hasBarCode = false;
    }

    var maxDiffWOBarDep = 3;
    if (!hasBarCode && !hasDep && !hasReason && (diff > maxDiffWOBarDep)) {
        alert("Выберите подразделение, причину или баркод");
        return;
    }

    WaitShow("spis");

    $.ajax({
        url: "https://s2010/complaints/api/info/GetWriteoffs?" + filtersGet,
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("spis", null);
            if (typeof (data) == "object") {
                PrepareDataSpis(data)
            };
        },
        error: function () {
            WaitHide("spis", "Произошла ошибка при загрузке списаний");
        }
    })


}


function PrepareDataSpis(data) {
    var data_source = [];



    var cnt = 0;
    var cnt_prod = 0;
    var sum = 0;

    data.forEach(function (item, idx) {
        var obj = new Object();
        obj["DateAkt"] = item["DateAkt"];
        obj["NumAkt"] = item["NumAkt"];
        obj["DateChanges"] = item["DateChanges"];
        obj["CodGood"] = item["CodGood"];
        obj["NameGood"] = item["NameGood"];
        obj["Quan"] = item["Quan"];
        if (!isNaN(item["Quan"]))
            cnt_prod += item["Quan"];
        var codPr = CodProvs.filter(_pr => _pr.Cod == item["CodProv"]);
        obj["CodProv"] = (codPr.length > 0 ? codPr[0].Name : "???");
        obj["Sum"] = item["SUM"];
        data_source.push(obj);
        cnt++;
        if (!isNaN(item["SUM"]))
            sum += item["SUM"];
    });

    $("#spis_cnt").val(cnt);
    $("#spis_cnt_prod").val(cnt_prod);
    $("#spis_sum").val(sum);

    function excelexport(e) {
        var colFormats = [];
        $("#grid_spis").data("kendoGrid").columns.forEach(_col => {
            try {
                if (_col.format != null) colFormats[_col.title] = _col.format.split(":")[1].replace("}", "");
            } catch { }
        })

        var sheet = e.workbook.sheets[0];

        var row0 = sheet.rows[0];
        for (var cellIndex = 1/*0*/; cellIndex < row0.cells.length; cellIndex++) {
            sheet.columns[cellIndex].width = 105;
            sheet.columns[cellIndex].autoWidth = false;
            var cell = row0.cells[cellIndex];
            cell.wrap = true;
            cell.verticalAlign = "top";
        }
        var cell0 = row0.cells[0];
        cell0.verticalAlign = "top";

        //
        for (var rowIndex = 1/*0*/; rowIndex < sheet.rows.length; rowIndex++) {
            var row = sheet.rows[rowIndex];
            row.cells[0].value = kendo.parseDate(row.cells[0].value, 'yyyy-MM-ddTHH:mm:ss');

            row.cells[2].value = kendo.parseDate(row.cells[2].value, 'yyyy-MM-ddTHH:mm:ss');
            row.cells[2].format = "dd.MM.yyyy HH:mm";
        }
    }

    $("#box_spis").append("<div id='grid_spis'></div>");
    $("#grid_spis").kendoGrid({
        toolbar: ["excel"],
        excelExport: excelexport,
        excel: {
            allPages: true,
            fileName: "Writeoffs.xlsx"
        },
        columns: [{
            field: "DateAkt",
            title: "Дата накладной",
            width: "150px",
            template: function (dataItem) {
                return "<b>" + kendo.toString(kendo.parseDate(dataItem.DateAkt, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "</b>";//ShowCalculation(barCode, numAkt)
            }
        }, {
            field: "NumAkt",
            title: "Номер накладной",
            width: "110px",
            template: function (dataItem) {
                return "<b>" + String(dataItem.NumAkt) + "</b>";// + " от " + kendo.toString(kendo.parseDate(dataItem.DateCalc, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "</b>";
            }
        },
            {
                field: "DateChanges",
                title: "Дата накладной",
                width: "150px",
                template: function (dataItem) {
                    return kendo.toString(kendo.parseDate(dataItem.DateChanges, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy HH:mm');//ShowCalculation(barCode, numAkt)
                }
            },
            {
                field: "CodGood",
                title: "Баркод",
                width: "110px",
                template: function (dataItem) {
                    return "<b>" + String(dataItem.CodGood) + "</b>";
                }
            },
            {
                field: "NameGood",
                title: "Название",
                template: function (dataItem) {
                    return "<b>" + String(dataItem.NameGood) + "</b>";
                }
            },
            {
                field: "Quan",
                title: "Кол-во",
                width: "110px",
                template: function (dataItem) {
                    return String(dataItem.Quan);
                }
            },
            {
                field: "CodProv",
                title: "Причина",
                width: "250px",
                template: function (dataItem) {
                    return String(dataItem.CodProv);
                }
            },
            {
                field: "Sum",
                title: "Сумма",
                width: "110px"
            }
        ],
        sortable: true,
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source
    });

    //$("#grid_spis").data("kendoGrid").dataSource.sort({ field: "DateAkt", dir: "asc" });
    $("#grid_spis").data("kendoGrid").dataSource.sort(x =>
    {
        x.Add(y => y.DateAkt).Descending();
        x.Add(y => y.NumAkt).Descending();
    });
    $("#grid_spis").data("kendoGrid").dataSource.read();




}









function RefreshProrab() {

    var startDate = $("#datepickerstart_prorab").data("kendoDatePicker").value();
    var endDate = $("#datepickerend_prorab").data("kendoDatePicker").value();
    var diff = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24);



    var grid = $("#grid_prorab").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_prorab").remove();

    var SD = $("#datepickerstart_prorab").val().split('/');
    var ED = $("#datepickerend_prorab").val().split('/');


    var FStartDate = SD[2] + SD[1] + SD[0];
    var FEndDate = ED[2] + ED[1] + ED[0];

    var filtersGet = "FStartDate=" + FStartDate + "&FEndDate=" + FEndDate;

    var hasDep = true;
    var hasBarCode = true;

    var depId = $("#prorab_deps").data("kendoComboBox").value();
    if (depId != "" && depId != "ALL")
        filtersGet += "&CodShop=" + depId;
    else {
        hasDep = false;
        //// Убрать возможность смотреть за все подразделения !!!
        //if (UserDepLinks.length > 0) {
        //    var comboBox = $("#prorab_deps").data("kendoComboBox");
        //    comboBox.select(0);
        //    depId = $("#prorab_deps").data("kendoComboBox").value();
        //    filtersGet += "&CodShop=" + depId;
        //} 147102
    }


    var barCode = $("#prorab_barcode").val();
    if (!isNaN(parseInt(barCode)))
        filtersGet += "&CodGood=" + barCode;
    else {
        hasBarCode = false;
    }

    var barMode = $("#prorab_barcode_mode").data("kendoComboBox").value();
    if (barMode != null)
        filtersGet += "&BarCodeFilterMode=" + barMode;

    var maxDiff = hasBarCode ? 365 : (userFunctionId == 2009 ? 3 : 31)

    if (diff > (maxDiff + 1)) {
        alert("Пока доступна выборка не более чем за " + String(maxDiff) + " дн.");
        return;
    }

    if (!hasBarCode && !hasDep) {
        //alert("Выберите подразделение или баркод");
        //return;
    }

    WaitShow("prorab");

    $.ajax({
        url: "https://s2010/complaints/api/info/GetReworked?" + filtersGet,
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("prorab", null);
            if (typeof (data) == "object") {
                PrepareDataProrab(data)
            };
        },
        error: function () {
            WaitHide("prorab", "Произошла ошибка при загрузке проработок");
        }
    })


}


function PrepareDataProrab(data) {
    var data_source = [];

    var showOutPercent = $("#prorab_show_out").is(":checked");

    var cnt = 0;

    data.forEach(function (item, idx) {
        var obj = new Object();
        obj["DateAkt"] = item["DateAkt"];
        obj["NumAkt"] = item["NumAkt"];
        obj["Meas"] = item["Meas"];
        obj["CodGood"] = item["CodGood"];
        obj["NameGood"] = item["NameGood"];
        obj["Quan"] = item["Quan"];
        obj["Cost"] = item["Cost"];
        obj["MeasK"] = item["MeasK"];
        obj["CodGoodK"] = item["CodGoodK"];
        obj["NameGoodK"] = item["NameGoodK"];
        obj["QuanK"] = item["QuanK"];
        obj["CostK"] = item["CostK"];
        obj["RetreatPercent"] = (obj["Meas"] == obj["MeasK"] && obj["QuanK"] <= obj["Quan"]) ? ((1 - (obj["QuanK"] / obj["Quan"])) * 100) : (null);
        obj["OutPercent"] = (obj["Meas"] == obj["MeasK"]) ? (((obj["QuanK"] / obj["Quan"])) * 100) : (null);   
        data_source.push(obj);
        cnt++;
    });

    $("#prorab_cnt").val(cnt);

    function excelexport(e) {
        var colFormats = [];
        $("#grid_prorab").data("kendoGrid").columns.forEach(_col => {
            try {
                if (_col.format != null) colFormats[_col.title] = _col.format.split(":")[1].replace("}", "");
            } catch { }
        })

        var sheet = e.workbook.sheets[0];

        var row0 = sheet.rows[0];
        for (var cellIndex = 1/*0*/; cellIndex < row0.cells.length; cellIndex++) {
            sheet.columns[cellIndex].width = 105;
            sheet.columns[cellIndex].autoWidth = false;
            var cell = row0.cells[cellIndex];
            cell.wrap = true;
            cell.verticalAlign = "top";
        }
        var cell0 = row0.cells[0];
        cell0.verticalAlign = "top";



        //
        for (var rowIndex = 1/*0*/; rowIndex < sheet.rows.length; rowIndex++) {
            var row = sheet.rows[rowIndex];
            row.cells[0].value = kendo.parseDate(row.cells[0].value, 'yyyy-MM-ddTHH:mm:ss');
            if (row.cells[8].value != null) {
                row.cells[8].value /= 100;
                row.cells[8].format = "0.00 %";
            }
        }
    }

    $("#box_prorab").append("<div id='grid_prorab'></div>");
    $("#grid_prorab").kendoGrid({
        toolbar: ["excel"],
        excelExport: excelexport,
        excel: {
            allPages: true,
            fileName: "Reworked.xlsx"
        },
        columns: [{
            field: "DateAkt",
            title: "Дата накладной",
            width: "150px",
            template: function (dataItem) {
                return "<b>" + kendo.toString(kendo.parseDate(dataItem.DateAkt, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "</b>";//ShowCalculation(barCode, numAkt)
            }
        }, {
            field: "NumAkt",
            title: "Номер накладной",
            width: "110px",
            template: function (dataItem) {
                return "<b>" + String(dataItem.NumAkt) + "</b>";// + " от " + kendo.toString(kendo.parseDate(dataItem.DateCalc, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "</b>";
            }
        },
        {
            field: "CodGood",
            title: "Баркод ВХОД",
            width: "110px",
            template: function (dataItem) {
                return "<b>" + String(dataItem.CodGood) + "</b>";
            }
        },
        {
            field: "NameGood",
            title: "Название ВХОД"
            },
            {
                field: "Cost",
                title: "Цена ВХОД",
                width: "110px",
                template: function (dataItem) {
                    return String(dataItem.Cost);// + ((dataItem.Meas != dataItem.MeasK) ? ("  <a style='cursor:pointer;color:DarkRed;' title='Разные единицы измерения у входной и выходной номенклатуры!'>🛈</a>") : "");
                }
            },
        {
            field: "Quan",
            title: "Кол-во ВХОД",
            width: "110px"
            },
            {
                field: "CodGoodK",
                title: "Баркод ВЫХОД",
                width: "110px",
                template: function (dataItem) {
                    return "<b>" + String(dataItem.CodGoodK) + "</b>";
                }
            },
            {
                field: "NameGoodK",
                title: "Название ВЫХОД"
            },
            {
                field: "CostK",
                title: "Цена ВЫХОД", 
                width: "110px",
                template: function (dataItem) {
                    return String(dataItem.CostK) + ((dataItem.Meas != dataItem.MeasK) ? ("  <a style='cursor:pointer;color:DarkRed;' title='Разные единицы измерения у входной и выходной номенклатуры!'>🛈</a>"):"");
                }
            },
            {
                field: "QuanK",
                title: "Кол-во ВЫХОД",
                width: "110px"
            },
            {
                field: "OutPercent",
                title: "Выход",
                width: "100px",
                template: function (dataItem) {
                    return (dataItem.OutPercent != null) ? (((dataItem.OutPercent >= 10) ? (dataItem.OutPercent.toFixed(0)) : (dataItem.OutPercent.toFixed(2))) + " %") : ("-");
                },
                hidden: !showOutPercent
            },
             {   field: "RetreatPercent",
                title: "Отход *",
                width: "100px",
                template: function (dataItem) {
                    return (dataItem.RetreatPercent != null) ? (((dataItem.RetreatPercent >= 10) ? (dataItem.RetreatPercent.toFixed(0)) : (dataItem.RetreatPercent.toFixed(2))) + " %") : ("-");
                }
        }
        ],
        sortable: true,
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source
    });

    $("#grid_prorab").data("kendoGrid").dataSource.sort(x => {
        x.Add(y => y.DateAkt).Descending();
        x.Add(y => y.NumAkt).Descending();
        x.Add(y => y.CodGood).Descending();
    });
    $("#grid_prorab").data("kendoGrid").dataSource.read();




}






function WaitShow(page) {
    $("#grid_" + page).css("display", "none");
    $("#box_" + page).append('<img id="gridWait_' + page + '" style="width: 10%; margin-top:50px;margin-left:45%; margin-right:45%" src="https://s2010/feedback/wait5.gif" />');
}

function WaitHide(page, msg) {
    $("#gridWait_" + page).remove();
    if(msg != null)
        alert(msg);
    $("#grid_" + page).css("display", "block");
}






function print(divId, title) {
    //window.print();
    var divToPrint = document.getElementById(divId);
    var htmlToPrint = '' +
        '<style type="text/css">' +
        'table th, table td {' +
        'border:1px solid #000;' +
        'padding;0.5em;' +
        '}' +
        '</style>';
    htmlToPrint += divToPrint.outerHTML;
    newWin = window.open("");
    newWin.document.write("<h3 align='center'>" + title + "</h3>");
    $("#" + divId).children().each(function (index) {
        $(this).clone(true).appendTo(newWin.document);
    });
    //newWin.document.write(htmlToPrint);
    newWin.print();
    newWin.close();
}

function RefreshPrType() {

    var barc = $("#prtype_barcode").val();
    if (isNaN(barc) || (!isNaN(barc) && (Number(barc) > 9999999 || Number(barc) < 100000))) {
        alert("Введите корректный баркод")
        return
    }

    var grid = $("#grid_prtype").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_prtype").remove();

    $.ajax({
        url: "https://s2010/complaints/api/info/GetProducedTypeForBarcod?CodGood=" + barc,
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {
                PrepareDataPrType(data, barc)
            };
        },
        error: function () {
            alert("Ошибка загрузки!");
        }
    })
}

function PrepareDataPrType(dataResponce, barcod) {
    var data_source = [];
    var ListColumn = [];

    if (dataResponce.NameGood != null)
        $("#prtype_barcode_name").val(dataResponce.NameGood);

    var data = dataResponce.Data != null ? dataResponce.Data: dataResponce;

    data.forEach(function (item) {
        var columns = new Object();
        columns.field = "C_" + String(item.Dep);
        //calcDeps.push(item);
        var dep = DepartmentList.filter(_dep => _dep.DepNum == item.Dep);
        columns.title = String(item.Dep)//"<b>"+String(item.Dep)+"</b>" + (dep.length > 0 ? (" " + dep[0].DepName):"");
        columns.width = "80px";
        columns.headerAttributes = { style: "vertical-align: top;" };
        columns.template = function (dataItem) {
            var field = "C_" + String(item.Dep);
            if (dataItem.isFirstRow)
                return "<input type='checkbox' id='PrShopChecked_" + String(item.Dep) + "' onclick='SetPrShopChecked(" + String(item.Dep) + ")'>";
            else
                return (dataItem[field] != null && dataItem[field].Date != null)
                    ? kendo.toString(kendo.parseDate(dataItem[field].Date, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yy') + "<br/><strong style='color:" + (dataItem[field].Value=="заказ"?"green":"blue")+"'>" + dataItem[field].Value + "</strong>"
                : "";            
        };
        columns.editable = function () { return false; };
        ListColumn.push(columns);  

        item.Values.forEach(function (val, ind) {
            if (data_source.length < (ind + 1))
                data_source.push(new Object())
            data_source[ind]["C_" + String(item.Dep)] = { Date: val.Date, Value: val.Value }
        })
    })

    var firstRow = { isFirstRow: true, Barcod: barcod};
    ListColumn.forEach(function (item) { firstRow[item.field]=false })
    data_source.unshift(firstRow);

    $("#box_prtype").append("<div id='grid_prtype'></div>");
    $("#grid_prtype").kendoGrid({
        /*toolbar: ["excel"],*/
        columns: ListColumn,
        sortable: true,
        height: 750,
        width: 1600,
        resizable: true,
        navigatable: true,
        dataSource: data_source,
        dataBound: function () {
            $('#grid_pahar .k-grid-content').height("100%");
            $('#grid_pahar .k-grid-content').width("1600px");
        }
    });

    $("#grid_prtype").data("kendoGrid").dataSource.read();
}

function SetPrShopChecked(dep) {
    $("#grid_prtype").data("kendoGrid").dataSource.at(0)["C_" + dep] = $("#PrShopChecked_" + String(dep)).is(":checked");
}




function SetPrType() {
    $("#context-menu-prtype").data("kendoContextMenu").open();
}

function SetPrTypeSend(value, rewriteExistsDate) {

    if (!$("#grid_prtype").data("kendoGrid") || !$("#grid_prtype").data("kendoGrid").dataSource) {
        alert("Ничего не выбрано!")
        return
    }

    var deps = []
    var data = $("#grid_prtype").data("kendoGrid").dataSource;

    

    $("#grid_prtype").data("kendoGrid").columns.forEach(function (col) {
        if (data.at(0)[col.field] === true && col.field.slice(0, 2) == "C_") {
            var obj = new Object();
            obj.Dep = Number(col.field.slice(2))
            if (data.at(1) != null && data.at(1)[col.field].Date != null && rewriteExistsDate)
                obj.Date = kendo.toString(data.at(1)[col.field].Date, 'dd/MM/yyyy')
            else
                obj.Date = kendo.toString(new Date(), 'dd/MM/yyyy')
            deps.push(obj);
        }
    })

    if (deps.length == 0)
        alert("Ни одного подразделения не выбрано!")
    else {

        if (!confirm("Действие не обратимо. Принять изменения?"))
            return;

        var send_data = new Object();
        send_data.Barcode = data.at(0).Barcod
        send_data.DateDeps = deps
        send_data.Value = value
        $.ajax({
            url: "https://" + host + complaints + "/api/Info/PostProducedTypeForBarcod",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(send_data),
            success: function (data) {
                if (typeof (data) == "object") {
                    PrepareDataPrType(data, send_data.Barcode)
                };
            },
            error: function () {
                alert("Ошибка записи!");
            }
        })
    }
}