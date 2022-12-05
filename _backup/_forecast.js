
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

var months = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"]

var ForecastDimDatePrev;
var MnuDimLightedBarcod;

var forecast_prev_val;

var forecast_calc_start_time

class FileForecast {
    id = null;
    name = "";
    createdMenu = false;
    createdForecast = false;
    savedMenu = false;
    savedForecast = false;
    constructor(id, name) { this.id = id; this.name = name; }
}
var File = null;
var hideMnuDimsDetails = false;

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
                


        var _today = new Date();
        var _priorDate = new Date(new Date().setDate(_today.getDate()));

     

        $("#datepicker_forecast").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepicker_forecast").data("kendoDatePicker").value(_today);

        $("#datepicker_forecast_dim").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepicker_forecast_dim").data("kendoDatePicker").value(_today);
        ForecastDimDatePrev = _today;

        $("#datepicker_forecast_calc_recipe_bind_max").kendoDatePicker({ format: "dd/MM/yyyy" });
        var monthPlus = new Date();
        var nextMonth = monthPlus.setMonth(monthPlus.getMonth() + 1);
        //var nextMonth = monthPlus.getMonth() + 1;
        //if (nextMonth < 12)
        //    monthPlus.setMonth(nextMonth);
        //else {
        //    monthPlus.setMonth(1);
        //    monthPlus.setYear(monthPlus.getYear() + 1);
        //}
        $("#datepicker_forecast_calc_recipe_bind_max").data("kendoDatePicker").value(monthPlus);
     
        $("#forecast_dim").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
    
        $("#forecast_calc_recipe_mode").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#forecast_calc_recipe_mode").data("kendoComboBox").setDataSource([
            { value: 0, text: "Техкарты подразделений в количестве произведнных" },
            { value: 371, text: "Техкарта Лубянки (371)" },
        ]);






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


        



        var window_forecast_source = $("#window_forecast_source")
        window_forecast_source.kendoWindow({
            actions: ["Close"],
            width: "1000px",
            height: "800px",
            modal: true,
            resizable: true,
            title: "Источники",
            visible: false,
            sizable: true,
            minWidth: 1000,
            //open: adjustSize,
            adjustSize: {
                width: 1000,
                height: 800
            }
        });

        var window_forecast_deps = $("#window_forecast_deps")
        window_forecast_deps.kendoWindow({
            actions: ["Close"],
            width: "800px",
            height: "800px",
            modal: true,
            resizable: false,
            title: "Подразделения",
            visible: false,
            sizable: true,
            //open: adjustSize,
            adjustSize: {
                width: 600,
                height: 800
            }
        });
        $("#window_forecast_deps").data("kendoWindow")
            .bind("close", function (e) {
                ForeCastDepsOk();
            });

        var window_forecast_cass_groups = $("#window_forecast_cass_groups")
        window_forecast_cass_groups.kendoWindow({
            actions: ["Close"],
            width: "800px",
            height: "800px",
            modal: true,
            resizable: false,
            title: "Кассовые группы",
            visible: false,
            sizable: true,
            //open: adjustSize,
            adjustSize: {
                width: 600,
                height: 800
            }
        });
        $("#window_forecast_cass_groups").data("kendoWindow")
            .bind("close", function (e) {
                ForeCastCGOk();
            });

        var window_forecast_mnu_dim = $("#window_forecast_mnu_dim")
        window_forecast_mnu_dim.kendoWindow({
            actions: ["Close"],
            width: "800px",
            height: "800px",
            modal: true,
            resizable: false,
            title: "Документ",
            visible: false,
            sizable: true,
            //open: adjustSize,
            adjustSize: {
                width: 600,
                height: 800
            }
        });

        var window_forecast_sales_bydeps = $("#window_forecast_sales_bydeps")
        window_forecast_sales_bydeps.kendoWindow({
            actions: ["Close"],
            width: "800px",
            height: "665px",
            modal: true,
            resizable: false,
            title: "Подразделения",
            visible: false,
            sizable: true,
            //open: adjustSize,
            adjustSize: {
                width: 600,
                height: 665
            }
        });

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

        var window_forecast_files = $("#window_forecast_files")
        window_forecast_files.kendoWindow({
            actions: ["Close"],
            width: "800px",
            height: "600px",
            modal: true,
            resizable: false,
            title: "Прогнозы продаж",
            visible: false,
            sizable: true,
            //open: adjustSize,
            adjustSize: {
                width: 800,
                height: 600
            }
        });
        var monthMinus = new Date();
        var prevMonth = monthMinus.getMonth() - 1;
        prevMonth = (prevMonth >= 0 ? prevMonth : 11);
        $("#forecast_prev_month_label_div").empty();
        $("#forecast_prev_month_label_div").append('<p id="forecast_prev_month_label">Продажи&nbsp;за&nbsp;' + months[prevMonth] + '</p>');
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

                        userFunctionId = item.Function.FunctionId;


                        var Permissions = new Object();
                        Permissions.Edit = item.NativeRight.Edit;
                        Permissions.Delete = item.NativeRight.Delete;
                        Permissions.Add = item.NativeRight.Add;
                        Permissions.View = item.NativeRight.View;

                        Function.Permissions = Permissions;

                        RoleUser.AvailableFunction[item.Function.FunctionName] = Function;

                    });

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

  
    $("#forecast_dim").data("kendoComboBox").destroy();
    $("#forecast_calc_recipe_mode").data("kendoComboBox").destroy();
    //$("#forecast_deps").data("kendoComboBox").destroy();
  
    $("#datepicker_forecast").data("kendoDatePicker").destroy();
    $("#datepicker_forecast_dim").data("kendoDatePicker").destroy();
    $("#datepicker_forecast_calc_recipe_bind_max").data("kendoDatePicker").destroy();


    var grid_forecast_mnu = $("#grid_forecast_mnu").data("kendoGrid");
    if (grid_forecast_mnu) {
        grid_forecast_mnu.destroy();
    }
    var grid_forecast_dim = $("#grid_forecast_dim").data("kendoGrid");
    if (grid_forecast_dim) {
        grid_forecast_dim.destroy();
    }
 
    $("#grid_forecast").data("kendoGrid").destroy();
    $("#grid_forecast_mnu").data("kendoGrid").destroy();
    $("#grid_forecast_dim").data("kendoGrid").destroy();
    $("#grid_forecast_calc").data("kendoGrid").destroy();

    var grid_technology = $("#grid_technology").data("kendoGrid");
    if (grid_technology) {
        grid_technology.destroy();
    }
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
            } else {
                onExit();
            }
        }
    });
}


// ***** Отрисовка гридов





function RefreshForecast() {

    if (CassGroups.length == 0) {
        getCassGroups(false);
    }

    var date = $("#datepicker_forecast").data("kendoDatePicker").value();

    var grid = $("#grid_forecast").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_forecast").remove();

    var DT = $("#datepicker_forecast").val().split('/');
    var FDate = DT[2] + DT[1] + DT[0];
    var filtersGet = "FDate=" + FDate;

    var DTDim = $("#datepicker_forecast_dim").val().split('/');
    var FDimDate = DTDim[2] + DTDim[1] + DTDim[0];
    var filtersGet = "FDimDate=" + FDimDate;

    var depId = $("#forecast_deps").val();;
    if (depId != "" && depId != "ALL" && depId.toLowerCase() != "все")
        filtersGet += "&CodShop=" + depId;
    else {

    }
    var cassGr = $("#forecast_cass_groups").val();;
    if (cassGr != "" && cassGr != "ALL" && cassGr.toLowerCase() != "все")
        filtersGet += "&CassGroups=" + cassGr;
    else {

    }


    filtersGet += $("#forecast_exclude_static_groups").is(":checked") ? "&ExcludeStaticGroups=true" : "";







    WaitShow("forecast");

    $.ajax({
        url: "https://s2010/complaints/api/info/GetForecastTemplate?" + filtersGet,
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {
                WaitHide("forecast", null);

                PrepareDataForecast(data)
            };
        },
        error: function () {
            WaitHide("forecast", "Произошла ошибка при загрузке шаблона прогноза");
        }
    })


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

function GetOperName(short) {
    if (short == "I") return "Ввод";
    if (short == "O") return "Вывод";
    if (short == "C") return "Изм.";
    return null; // Обязательно Null в случае меню !!!
}

function GetOperDescForCassGr(oper) {
    if (oper == null)
        return "";
    else {
        var types = oper.map(_src => GetOperName(_src.src)).filter((value, index, arr) => value != null && arr.indexOf(value) === index);
        return types.join('/');
    }
}
function GetOperDesc(barcod, oper) {
    if (barcod == null || oper == null)
        return { text: "", mainCG: true };
    var result = GetOperDescForCassGr(oper);
    if (result != "") {
        return { text: result, mainCG: true };
    }
    else {
        result = { text: "", mainCG: true };
        var data = $("#grid_forecast").data("kendoGrid").dataSource;
        data.data().forEach(function (item) {
            if (item.Barcod == barcod) {
                var barOper = item.Oper.filter(_op => _op.cod_casgr != oper[0].cod_casgr);
                if (barOper.length > 0) {
                    var res = GetOperDescForCassGr(barOper);
                    if (res != null) {
                        result = { text: res, mainCG: false };
                    }
                }
            }
        });
        return result;
    }   
    //if (oper == null)
    //    return "";
    //else {
    //    var types = oper.map(_src => GetOperName(_src.src)).filter((value, index, arr) => value != null && arr.indexOf(value) === index);
    //    return types.join('/');
    //}
}
function GetOperPrice(oper) {
    if (oper == null)
        return "";
    else {
        var prices = oper.map(_src => _src.price).filter((value, index, arr) => value != null && arr.indexOf(value) === index);
        return prices.join(',');
    }
}

function GetShopOperForCassGr(shop, oper) {
    var typesInShop = oper.filter(_src => _src.shops.indexOf(shop) != -1);
    var typesNoMenu = typesInShop.map(_src => GetOperName(_src.src)).filter((value, index, arr) => value != null && arr.indexOf(value) === index);
    if (typesNoMenu.length > 0) {
        return typesNoMenu.join('/');
    }
    else return typesInShop.length > 0 ? "м" : "";    
}

function GetShopOper(barcod, shop, oper) {
    var result = GetShopOperForCassGr(shop, oper);
    if (result != "") {
        return { text: result, mainCG : true};
    }
    else {
        result = { text: "", mainCG: true };
        var data = $("#grid_forecast").data("kendoGrid").dataSource;
        data.data().forEach(function (item) {
            if (item.Barcod == barcod) {
                var barOper = item.Oper.filter(_op => _op.shops.indexOf(shop) != -1 && _op.cod_casgr != oper[0].cod_casgr);
                if (barOper.length > 0) {
                    var res = GetShopOperForCassGr(shop, barOper);
                    if (res != "") {
                        result = { text: res, mainCG: false };
                    }
                }
            }
        });
        return result;
    }   
}

function GetCompactScr(src) {
    var res = new Object();
    res.num_doc = src.num_doc;
    res.price = src.price;
    res.shops = src.shops;
    res.src = src.src;
    res.cod_casgr = src.cod_casgr;
    return res;
}

function GetBarcodSourcesLink(barCode, dep, cassGroup, barCodeName, cassGroupName) {

    var label = "(см.)"
    var title = "";

    var groups = [];

    var data = $("#grid_forecast").data("kendoGrid").dataSource;
    data.data().forEach(function (item) {
        if (item.Barcod == barCode) {
            item.Oper.forEach(function (oper) {
                if (groups.indexOf(oper.cod_casgr) == -1) groups.push(oper.cod_casgr);
            });
        }
    });

    if (groups.length > 1) {
        label = "<b>!!!</b>";
        title = " title='Баркод входит в несколько кассовых групп: " + groups.join(",") + "'";
    }

    return "<a style='cursor:pointer;color:DarkBlue;text-decoration: underline;' onclick='ShowForecastSources(" + barCode + ",null,null,\x22" + barCodeName + "\x22,null)'" + title + ">" + label + "</a>"
}

function PrepareDataForecast(data) {

    var monthMinus = new Date();
    var prevMonth = monthMinus.getMonth() - 1;
    prevMonth = (prevMonth >= 0 ? prevMonth : 11);


    $("#forecast_date_time").val(kendo.toString(new Date(), 'dd.MM.yyyy HH:mm'));

    hideMnuDimsDetails = false;

    Mnu = data.Mnu;
    Dims = data.Dims;

    var data_source = [];

    var hasLinksInGrid = false;
    var calcCassGrs = [];
    data.CassGroups.forEach(function (item, idx) {
        var obj = new Object();
        var groupObj = CassGroups.filter(_gr => _gr["cod_casgr"] == item);
        obj["Name"] = String(item) + " " + (groupObj.length > 0 ? groupObj[0]["NAME"] : "???");
        data_source.push(obj);

        calcCassGrs.push(item);

        var sources = data.Sources.filter(_src => _src.cod_casgr == item);
        var barc = [];

        sources.forEach(function (src, idxSrc) {
            var bc = barc.filter(_bc => _bc["Barcod"] == src.bar_cod);
            if (bc.length == 0) {
                bc = new Object();
                bc["Barcod"] = src.bar_cod;
                var bName = data.Barcodes.filter(_bc => _bc.bar_cod == src.bar_cod);
                if (bName.length > 0) {
                    bc["Name"] = bName[0].NAME;
                    if (bName[0].loc_cod != null)
                        bc["Loccod"] = bName[0].loc_cod;
                }
                else
                    bc["Name"] = "";

                if (bName.length > 0 && bName[0].prev_quan != null)
                    bc["PrevValue"] = bName[0].prev_quan;
                bc["Oper"] = [];
                bc["Oper"].push(GetCompactScr(src));
                barc.push(bc);
            }
            else {
                bc[0]["Oper"].push(GetCompactScr(src));
            }
        });

        // Оставить локальники только тем, у кого есть в кассовой группе на них ссылаться
        barc.forEach(function (item, idx, array) {
            if (item.Loccod != null) {
                if (array.filter(_ar => _ar.Barcod == item.Loccod).length == 0)
                    item.Loccod = null;
                else
                    hasLinksInGrid = true;
            }
        });

        barc.sort(function (a, b) {
            return (a.Loccod ?? a.Barcod) - (b.Loccod ?? b.Barcod) || a.Barcod - b.Barcod;
        });
        barc.forEach(function (itemBarc, idxBarc) {
            data_source.push(itemBarc);
        });

        barc = null;
        sources = null;
    });

    $("#forecast_calc_cass_groups").val(calcCassGrs.join(","));


    data.Barcodes.forEach(function (itemRes) {
        var barCode = Number(itemRes.bar_cod);
        var value = Number(itemRes.prev_quan);
        if (value != 0) {
            var items = [];
            var hasDim = false;
            var hasNum = false;
            data_source.forEach(function (item) {
                if (item.Barcod != null && item.Barcod == barCode) {
                    if (item.Oper.filter(_op => _op.src == "I" || _op.src == "O" || _op.src == "C").length > 0)
                        hasDim = true;
                    if (!isNaN(item.Forecast))
                        hasNum = true;
                    items.push(item);
                }
            });

            if (!hasDim && !hasNum)
                items.forEach(function (item) { item.Forecast = value; });
        }
    });



    var ListColumn = [];
    var columns = new Object();
    columns.field = "PrevValue";
    columns.title = "За " + months[prevMonth];
    columns.width = "100px";
    columns.minResizableWidth = "100px";
    columns.headerAttributes = { style: "white- space: normal; vertical-align: top;" };
    columns.template = function (dataItem) {
        return (isNaN(dataItem.PrevValue))
            ? ""
            : ("<a style='cursor:pointer;color:DarkBlue;text-decoration: underline;' onclick='showSalesByDeps(" + dataItem.Barcod + ")'>" + String(dataItem.PrevValue) + "</a>");
    };
    columns.editable = function () { return false; };
    ListColumn.push(columns);

    var columns = new Object();
    columns.field = "Forecast";
    columns.title = "Прогноз";
    columns.width = "100px";
    columns.minResizableWidth = "100px";
    columns.headerAttributes = { style: "vertical-align: top;" };
    columns.template = function (dataItem) { return "<strong>" + (dataItem.Forecast != null ? String(dataItem.Forecast) : "") + "</strong>"; };
    columns.editable = function (dataItem) { return !isNaN(dataItem.Barcod); };
    ListColumn.push(columns);

    columns = new Object();
    columns.field = "Barcod";
    columns.title = "Баркод";
    columns.width = (hasLinksInGrid ? "120px":"85px");
    columns.minResizableWidth = (hasLinksInGrid ? "120px" : "85px");
    columns.headerAttributes = { style: "vertical-align: top;" };
    columns.template = function (dataItem) {
        if (dataItem.Loccod != null) {
            var ttt = dataItem.Loccod;
        }
        return (dataItem.Barcod != null ? (String(dataItem.Barcod) + (dataItem.Loccod != null ? ("&nbsp;&nbsp;&nbsp;<i style='color:darkgray'>" + String(dataItem.Loccod) + "</i>") : "")) : "");
    };
    columns.editable = function () { return false; };
    ListColumn.push(columns);

    columns = new Object();
    columns.field = "Name";
    columns.title = "Название";
    columns.width = "230px";
    columns.minResizableWidth = "230px";
    columns.headerAttributes = { style: "vertical-align: top;" };
    columns.template = function (dataItem) {
        return (isNaN(dataItem.Barcod))
            ? ("<b>" + dataItem.Name + "</b>")
            : (dataItem.Name + " " + GetBarcodSourcesLink(dataItem.Barcod, null, null, dataItem.Name.replaceAll("'",""),null));
    };
    columns.editable = function () { return false; };
    ListColumn.push(columns);

    columns = new Object(); 
    columns.field = "Price";
    columns.title = "Цена";
    columns.width = "70px";
    columns.minResizableWidth = "70px";
    columns.headerAttributes = { style: "vertical-align: top;" };
    columns.template = function (dataItem) {
        return GetOperPrice(dataItem.Oper);
    };
    columns.editable = function () { return false; };
    ListColumn.push(columns);

    columns = new Object();
    columns.field = "Oper";
    columns.title = "Операция";
    columns.width = "100px";
    columns.minResizableWidth = "100px";
    columns.headerAttributes = { style: "vertical-align: top;" };
    columns.template = function (dataItem) {
        var res = GetOperDesc(dataItem.Barcod, dataItem.Oper);
        if (res.text == "")
            return "";
        else {
            if (res.mainCG)
                return res.text;
            else
                return "<a style='color:#BBBBBB;cursor:pointer;text-decoration: underline;font-style: italic;' onclick='ShowForecastSources(" + dataItem.Barcod + ",null,null,\x22" + dataItem.Name.replaceAll("'", "") + "\x22,null)' title='В другой кассовой группе!'>" + res.text + "</a>";
        }
    };
    columns.editable = function () { return false; };
    ListColumn.push(columns);


    var calcDeps = [];
    data.Deps.forEach(function (item, idx) {
        var columns = new Object();
        columns.field = "C_" + String(item);
        calcDeps.push(item);
        var dep = DepartmentList.filter(_dep => _dep.DepNum == item);
        columns.title = String(item);
        columns.width = "60px";
        columns.headerAttributes = { style: "vertical-align: top;" };
        columns.template = function (dataItem) {
            if (isNaN(dataItem.Barcod)) {
                return ("  <a style='cursor:pointer;color:DarkBlue;text-decoration: underline;' onclick='ShowForecastSources(null," + String(item) + ",null,null,null)'>" + String(item) + "</a>");
            }
            else {
                var res = GetShopOper(dataItem.Barcod, item, dataItem.Oper);
                if (res.text == "")
                    return "";
                else {
                    if (res.mainCG)
                        return res.text;
                    else
                        return "<a style='color:#BBBBBB;cursor:pointer;text-decoration: underline;font-style: italic;' onclick='ShowForecastSources(" + dataItem.Barcod + ",null,null,\x22" + dataItem.Name.replaceAll("'", "") + "\x22,null)' title='В другой кассовой группе!'>" + res.text + "</a>";
                }
            } 
        };
        columns.editable = function () { return false; };
        ListColumn.push(columns);
    });
    $("#forecast_calc_deps").val(calcDeps.join(","));



    function excelexport(e) {
        var colFormats = [];
        $("#grid_forecast").data("kendoGrid").columns.forEach(_col => {
            try {
                if (_col.format != null) colFormats[_col.title] = _col.format.split(":")[1].replace("}", "");
            } catch { }
        })

        var sheet = e.workbook.sheets[0];

        var row0 = sheet.rows[0];
        row0.height = 30;
        sheet.columns[0].width = 70;
        sheet.columns[1].width = 70;
        sheet.columns[2].width = 70;
        sheet.columns[3].width = 210;
        sheet.columns[4].width = 100;
        sheet.columns[5].width = 100;
        for (var cellIndex = 6; cellIndex < row0.cells.length; cellIndex++) {
            sheet.columns[cellIndex].width = 45;
            sheet.columns[cellIndex].autoWidth = false;
        }

        var data = $("#grid_forecast").data("kendoGrid").dataSource;
        var i = 0;
        data.data().forEach(function (item) {
            i++;
            if (isNaN(sheet.rows[i].cells[2].value)) {
                sheet.rows[i].cells[3].bold = true;
            }
            else
            {
                sheet.rows[i].cells[2].textAlign = "left";
                if (sheet.rows[i].cells[2].value == item.Barcod) {
                    sheet.rows[i].cells[4].value = GetOperPrice(item.Oper);// Price
                    var operDesc = GetOperDesc(item.Barcod, item.Oper);// Oper
                    sheet.rows[i].cells[5].value = operDesc.text;
                    if (!operDesc.mainCG){
                        sheet.rows[i].cells[5].italic = true;
                        sheet.rows[i].cells[5].underline = true;
                        sheet.rows[i].cells[5].color = "#BBBBBB";
                    }

                    for (var j = 6; j < row0.cells.length; j++) {
                        var res = GetShopOper(Number(sheet.rows[i].cells[2].value), Number(sheet.rows[0].cells[j].value), item.Oper);
                        if (res.text != "") {
                            sheet.rows[i].cells[j].value = res.text;
                            if (!(res.mainCG && res.text.length > 1)) {
                                if(res.mainCG)
                                    sheet.rows[i].cells[j].color = "#999999";
                                else {
                                    sheet.rows[i].cells[j].italic = true;
                                    sheet.rows[i].cells[j].underline = true;
                                    sheet.rows[i].cells[j].color = "#BBBBBB";
                                 }
                            }
                        }
                    }
                }
                else {
                    // ERROR!!!!!!!!!!!
                }
            }
        });

    }

    $("#box_forecast").append("<div id='grid_forecast'></div>");
    $("#grid_forecast").kendoGrid({
        toolbar: ["excel"],
        excelExport: excelexport,
        excel: {
            allPages: true,
            fileName: "Forecast.xlsx"
        },
        columns: ListColumn,
        sortable: false,
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source,
        editable: true, // incell???
        cellClose: function (e) {
            if (e.model.Forecast != forecast_prev_val) {
                var promptVal = e.model.Forecast;
                var cancel = false;

                while (!cancel && promptVal != null && isNaN(promptVal)) {
                    var res = prompt("Введите числовое или пустое значение", promptVal);
                    if (res === null)
                        cancel = true;
                    else
                        promptVal = res;
                }
                if (cancel) {
                    e.model.Forecast = forecast_prev_val;
                    $(window).off('beforeunload');
                }
                else {
                    var barCod = e.model.Barcod;
                    var cassGr = e.model.Oper[0].cod_casgr;

                    var otherGr = [];

                    // Check many cassgr and confirm
                    var data = $("#grid_forecast").data("kendoGrid").dataSource;
                    data.data().forEach(function (item) {
                        if (item.Barcod == barCod) {
                            var barOper = item.Oper.filter(_op => _op.cod_casgr != cassGr);
                            if (barOper.length > 0) {
                                otherGr.push(barOper[0].cod_casgr);
                            }
                        }
                    });

                    if (otherGr.length > 0) {
                        if (confirm("Баркод содержится и в других кассовых группах (" + otherGr.join(",") + "). Это значение будет присвоего и для них. Продолжить?")) {
                            e.model.Forecast = promptVal;
                            data.data().forEach(function (item) {
                                if (item.Barcod == barCod && item.Oper.filter(_op => otherGr.indexOf(_op.cod_casgr) != -1).length > 0) {
                                    item.Forecast = promptVal;
                                }
                            });
                            $("#grid_forecast").data("kendoGrid").setDataSource(data);
                        }
                        else
                            e.model.Forecast = forecast_prev_val;
                    }
                    else {
                        e.model.Forecast = promptVal;
                    }


                    // put it to serverresponse
                    $(window).off('beforeunload');

                }
            }
            else {
                $(window).off('beforeunload');
            }
        },
        beforeEdit: function (e) {
            forecast_prev_val = e.model.Forecast;
            $(window).on('beforeunload', function () {
                return "В случае подтверждения закрытия окна браузера, все несохраненные данные будут утеряны.";
            });
        }
    });

    //$("#grid_forecast").data("kendoGrid").dataSource.sort({ field: "DateAkt", dir: "asc" });
    //$("#grid_forecast").data("kendoGrid").dataSource.sort(x => {
    //    x.Add(y => y.DateAkt).Descending();
    //    x.Add(y => y.NumAkt).Descending();
    //    x.Add(y => y.CodGood).Descending();
    //});
    $("#grid_forecast").data("kendoGrid").dataSource.read();




}



function GetDimBarcodOper(dim_cod, bar_cod) {
    if (bar_cod == null)
        return "";
    var result = "";
    var data = $("#grid_forecast").data("kendoGrid").dataSource;
    data.data().forEach(function (item) {
        if (item.Barcod == bar_cod) {
            var types = item.Oper.filter(_src => _src.src != "M" && _src.num_doc == dim_cod).map(_src => GetOperName(_src.src)).filter((value, index, arr) => value != null && arr.indexOf(value) === index);
            result = types.join('/');
        }
    });
    return result;   
}

function ShowForecastSources(barCode, dep, cassGroup, barCodeName, cassGroupName) {

    var data_source_mnu = Mnu;
    var data_source_dims = Dims;

    MnuDimLightedBarcod = barCode;

    if (barCode != null) {
        $("#forecast_source_barcod").val(String(barCode) + " " + barCodeName);

        data_source_mnu = [];
        data_source_dims = [];
        var data = $("#grid_forecast").data("kendoGrid").dataSource;
        data.data().forEach(function (item) {
            if (item.Barcod == barCode) {
                item.Oper.forEach(function (oper) {
                    if (oper.src == "M") {
                        if (data_source_mnu.filter(_doc => _doc.num_nakl == oper.num_doc).length == 0) {
                            var mnu = Mnu.filter(_doc => _doc.num_nakl == oper.num_doc);
                            //if (mnu.length > 0) data_source_mnu.push(mnu[0]);
                            if (mnu.length > 0) data_source_mnu.push({
                                    num_nakl : mnu[0].num_nakl,
                                    cod_shop : mnu[0].cod_shop,
                                    dt_nakl : mnu[0].dt_nakl,
                                    cod_casgr: oper.cod_casgr,
                                    name_doc : mnu[0].name_doc,
                                });
                        }
                    }
                    else {
                        if (data_source_dims.filter(_doc => _doc.cod_dim == oper.num_doc).length == 0) {
                            var dim = Dims.filter(_doc => _doc.cod_dim == oper.num_doc);
                            //if (dim.length > 0) data_source_dims.push(dim[0]);
                            if (dim.length > 0) data_source_dims.push({
                                cod_dim : dim[0].cod_dim,
                                name_dim : dim[0].name_dim,
                                dt_dim : dim[0].dt_dim,
                                cod_casgr: oper.cod_casgr,
                                comment : dim[0].comment,
                                oper : dim[0].oper,
                                dim2v : dim[0].dim2v,
                                comment2 : dim[0].comment2,
                                });
                        }
                    }
                });
            }
        });
    }
    else
        $("#forecast_source_barcod").val("-");
    if (dep != null) {
        $("#forecast_source_dep").val(String(dep));

        data_source_mnu = [];
        data_source_dims = [];
        var data = $("#grid_forecast").data("kendoGrid").dataSource;
        data.data().forEach(function (item) {
            if (item.Oper != null) {
                var mySrc = item.Oper.filter(_src => _src.shops.indexOf(dep) != -1);
                if (mySrc != null)
                mySrc.forEach(function (oper) {
                    if (oper.src == "M") {
                        if (data_source_mnu.filter(_doc => _doc.num_nakl == oper.num_doc).length == 0) {
                            var mnu = Mnu.filter(_doc => _doc.num_nakl == oper.num_doc);
                            if (mnu.length > 0) data_source_mnu.push(mnu[0]);
                        }
                    }
                    else {
                        if (data_source_dims.filter(_doc => _doc.cod_dim == oper.num_doc).length == 0) {
                            var dim = Dims.filter(_doc => _doc.cod_dim == oper.num_doc);
                            if (dim.length > 0) data_source_dims.push(dim[0]);
                        }
                    }
                });
        }
        });
    }
    else
        $("#forecast_source_dep").val("-");
    if (cassGroup != null)
        $("#forecast_source_cass_group").val(String(cassGroup) + " " + cassGroupName);
    else
        $("#forecast_source_cass_group").val("-");

    //function GetShopOper(shop, oper) {
    //    var typesInShop = oper.filter(_src => _src.shops.indexOf(shop) != -1);
    //    var typesNoMenu = typesInShop.map(_src => GetOperName(_src.src)).filter((value, index, arr) => value != null && arr.indexOf(value) === index);
    //    if (typesNoMenu.length > 0) {
    //        return typesNoMenu.join('/');
    //    }
    //    else
    //        return typesInShop.length > 0 ? "м" : "";
    //}
    //function GetCompactScr(src) {
    //    var res = new Object();
    //    res.num_doc = src.num_doc;
    //    res.price = src.price;
    //    res.shops = src.shops;
    //    res.src = src.src;
    //    return res;
    //}

    var grid_forecast_mnu = $("#grid_forecast_mnu").data("kendoGrid");
    if (grid_forecast_mnu) {
        grid_forecast_mnu.destroy();
    }
    $("#grid_forecast_mnu").remove();
    var grid_forecast_dim = $("#grid_forecast_dim").data("kendoGrid");
    if (grid_forecast_dim) {
        grid_forecast_dim.destroy();
    }
    $("#grid_forecast_dim").remove();

    $("#box_forecast_mnu").append("<div id='grid_forecast_mnu'></div>");
    $("#grid_forecast_mnu").kendoGrid({
        /*toolbar: ["excel"],*/
        columns: [{
            field: "num_nakl",
            title: "Номер док.",
            width: "100px"
        }, {
            field: "cod_shop",
            title: "Подр.",
            width: "80px"
        }, {
            field: "dt_nakl",
            title: "Дата док.",
            width: "110px",
            template: function (dataItem) {
                return "<b>" + kendo.toString(kendo.parseDate(dataItem.dt_nakl, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "</b>";//ShowCalculation(barCode, numAkt)
            }
            }, {
                field: "cod_casgr",
                title: "Касс.гр.",
                width: "80px"
            }, {
                field: "name_doc",
                title: "Название"
            },  {
            field: "show",
            title: symbolView + symbolView,//"☥",
            width: "65px",
            template: function (dataItem) {
                return "<button style='width:35px; min-width:35px;' class='k-primary k-button'; onclick='ShowMenuDim(" + String(dataItem.num_nakl) + ",false)'>" + symbolView + "</button>";
                },
            hidden: hideMnuDimsDetails
            }],
        sortable: true,
        height: 305,
        resizable: true,
        navigatable: true,
        dataSource: data_source_mnu
    });

    //$("#grid_forecast_mnu").data("kendoGrid").dataSource.sort({ field: "field0", dir: "asc" });   src.
    $("#grid_forecast_mnu").data("kendoGrid").dataSource.read();

  

    $("#box_forecast_dim").append("<div id='grid_forecast_dim'></div>");
    $("#grid_forecast_dim").kendoGrid({
        /*toolbar: ["excel"],*/
        columns: [{
            field: "cod_dim",
            title: "Номер ДиМ",
            width: "50px"
        }, {
            field: "name_dim",
            title: "Название"
        }, {
            field: "dt_dim",
            title: "Дата док.",
            width: "110px",
            template: function (dataItem) {
                return "<b>" + kendo.toString(kendo.parseDate(dataItem.dt_dim, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "</b>";//ShowCalculation(barCode, numAkt)
            }
            }, {
                field: "barcod_oper",
                title: "Опер.",
            width: "80px",
            hidden: barCode == null,
                template: function (dataItem) {
                    return GetDimBarcodOper(dataItem.cod_dim, barCode);
            }
            }, {
                field: "cod_casgr",
                title: "Касс.гр.",
                width: "80px"
            },{
                field: "comment",
                title: "Коммент ДиМ",
                width: "120px"
            }, {
            field: "oper",
            title: "Оператор",
            width: "120px"
        }, {
            field: "dim2v",
            title: "Версия",
            width: "70px"
        }, {
            field: "comment2",
            title: "Коммент версии",
            width: "185px"
            }, {
                field: "show",
                title: symbolView + symbolView,//"☥",
                width: "65px",
                template: function (dataItem) {
                    return "<button style='width:35px; min-width:35px;' class='k-primary k-button'; onclick='ShowMenuDim(" + String(dataItem.cod_dim) + ",true)'>" + symbolView + "</button>";
                },
                hidden: hideMnuDimsDetails
            }],
        sortable: true,
        height: 305,
        resizable: true,
        navigatable: true,
        dataSource: data_source_dims
    });

    //$("#grid_forecast_dim").data("kendoGrid").dataSource.sort({ field: "field0", dir: "asc" });
    $("#grid_forecast_dim").data("kendoGrid").dataSource.read();

    $("#window_forecast_source").data("kendoWindow").center().open();



}



function SelectForecastDeps() {

    var grid_forecast_deps = $("#grid_forecast_deps").data("kendoGrid");
    if (grid_forecast_deps) {
        grid_forecast_deps.destroy();
    }
    $("#grid_forecast_deps").remove();

    var selectedDeps = $("#forecast_deps").val().split(',');

    var deps = DepartmentList.filter(_dep => _dep.isActive);
    deps.sort(function (a, b) { return a.DepNum - b.DepNum; });
    var data_source = deps.map(function (_dep) { return { Sel: selectedDeps.indexOf(String(_dep.DepNum)) != -1, Num: _dep.DepNum, Name: _dep.DepName, Place: (_dep.Place.toLowerCase().trim() == "город" ? null : "Аэро") }; });
    //var data_source = deps.map(function (_dep) { return { Sel: selectedDeps.indexOf(String(_dep.DepNum)) != -1, Num: _dep.DepNum, Name: _dep.DepName, Place: _dep.Place }; });

    var depsOther = [];
    var depsFromText = $("#forecast_deps").val().trim().split(",");
    depsFromText.forEach(function (item) {
        if (item != null) {
            var txt = item.trim();
            if (item.length > 0 && !isNaN(item)) {
                if (deps.filter(_dep => _dep.DepNum == item).length == 0)
                    depsOther.push(item);
            }
        }
    });
    $("#forecast_deps_other").val(depsOther.join(','));


        $("#box_forecast_deps").append("<div id='grid_forecast_deps'></div>");
    $("#grid_forecast_deps").kendoGrid({
        /*toolbar: ["excel"],*/
        columns: [
            {
            field: "Sel",
            title: "Исп.",
                width: "60px",
                editable: true,
            template: function (dataItem) {
                return '<input type="checkbox" onclick="ForeCastDepsSet(' + String(dataItem.Num) + ')" id="grid_forecast_deps_sel_' + String(dataItem.Num)+'" style="width:20px;height:20px;" data-bind="source: Sel" ' + (dataItem.Sel ? 'checked="checked"' : "")+' />';
            }
                //template: '<input type="checkbox" style="width:20px;height:20px;" data-bind="source: Sel" #= Sel ? checked="checked" : ""# />'
        }, {
            field: "Num",
            title: "Номер",
            width: "85px"
        }, {
            field: "Name",
            title: "Название"
        }, {
            field: "Place",
            title: "Прим.",
            width: "120px"
        }],
        sortable: true,
        height: 600,
        resizable: true,
        navigatable: true,
        dataSource: data_source
    });

    //$("#grid_forecast_dim").data("kendoGrid").dataSource.sort({ field: "field0", dir: "asc" });
    $("#grid_forecast_deps").data("kendoGrid").dataSource.read();

    $("#window_forecast_deps").data("kendoWindow").center().open();

}
function SelectForecastCassGroups() {
    var DTDim = $("#datepicker_forecast_dim").val();

    if (CassGroups.length == 0 || ForecastDimDatePrev != DTDim) {
        ForecastDimDatePrev = DTDim;
        CassGroups = [];
        getCassGroups(true);
    }
    else {


        var grid_forecast_cgs = $("#grid_forecast_cass_groups").data("kendoGrid");
        if (grid_forecast_cgs) {
            grid_forecast_cgs.destroy();
        }
        $("#grid_forecast_cass_groups").remove();

        var selectedCgs = $("#forecast_cass_groups").val().split(',');

        //CassGroups.sort(function (a, b) { return (a.cod_casgr + (a.dims_use ? -1000000 : 0)) - (b.cod_casgr + (b.dims_use ? -1000000 : 0)); });
        CassGroups.sort(function (a, b) { return (a.cod_casgr - b.cod_casgr); });
        var data_source = CassGroups.map(function (_dep) { return { Sel: selectedCgs.indexOf(String(_dep.cod_casgr)) != -1, Num: _dep.cod_casgr, Name: _dep.NAME, DimUse: (_dep.dims_use ? "Исп. в ДиМ" : null) }; });

        $("#box_forecast_cass_groups").append("<div id='grid_forecast_cass_groups'></div>");
        $("#grid_forecast_cass_groups").kendoGrid({
            /*toolbar: ["excel"],*/
            columns: [
                {
                    field: "Sel",
                    title: "Исп.",
                    width: "60px",
                    editable: true,
                    template: function (dataItem) {
                        return '<input type="checkbox" onclick="ForeCastCGSet(' + String(dataItem.Num) + ')" id="grid_forecast_cass_groups_' + String(dataItem.Num) + '" style="width:20px;height:20px;" data-bind="source: Sel" ' + (dataItem.Sel ? 'checked="checked"' : "") + ' />';
                    }
                    //template: '<input type="checkbox" style="width:20px;height:20px;" data-bind="source: Sel" #= Sel ? checked="checked" : ""# />'
                }, {
                    field: "Num",
                    title: "Номер",
                    width: "85px"
                }, {
                    field: "Name",
                    title: "Название"
                }, {
                    field: "DimUse",
                    title: "Прим.",
                    width: "120px"
                }],
            sortable: true,
            height: 695,
            resizable: true,
            navigatable: true,
            dataSource: data_source
        });

        //$("#grid_forecast_dim").data("kendoGrid").dataSource.sort({ field: "field0", dir: "asc" });
        $("#grid_forecast_cass_groups").data("kendoGrid").dataSource.read();

        $("#window_forecast_cass_groups").data("kendoWindow").center().open();

    }
}


function getCassGroups(showSelectWindow) {
    var DTDim = $("#datepicker_forecast_dim").val().split('/');
    var FDimDate = DTDim[2] + DTDim[1] + DTDim[0];

    $.ajax({
        url: "https://" + host + complaints + "/api/Info/GetCassGroups?FDate=" + FDimDate,
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {

                CassGroups = []
                data.forEach(function (item) {
                    CassGroups.push(item);
                });

                if (showSelectWindow) {
                    SelectForecastCassGroups();
                }

            } else {
                onExit();
            }
        }
    });

}




function ForeCastDepsSelectAero() {
    var data = $("#grid_forecast_deps").data("kendoGrid").dataSource;
    data.data().forEach(function (item) { item.Sel = (item.Place != null) });
    $("#grid_forecast_deps").data("kendoGrid").setDataSource(data);
}
function ForeCastDepsSelectCity() {
    var data = $("#grid_forecast_deps").data("kendoGrid").dataSource;
    data.data().forEach(function (item) { item.Sel = (item.Place == null) });
    $("#grid_forecast_deps").data("kendoGrid").setDataSource(data);
}
function ForeCastDepsDeselectAll() {
    var data = $("#grid_forecast_deps").data("kendoGrid").dataSource;
    data.data().forEach(function (item) { item.Sel = false });
    $("#grid_forecast_deps").data("kendoGrid").setDataSource(data);
}
function ForeCastDepsSelectAll() {
    var data = $("#grid_forecast_deps").data("kendoGrid").dataSource;
    data.data().forEach(function (item) { item.Sel = false });
    $("#grid_forecast_deps").data("kendoGrid").setDataSource(data);

    $("#window_forecast_deps").data("kendoWindow").center().close();
}
function ForeCastDepsSet(depNum) {
    var data = $("#grid_forecast_deps").data("kendoGrid").dataSource;
    var selVal = $("#grid_forecast_deps_sel_" + String(depNum)).is(":checked");
    data.data().forEach(function (item) { if (item.Num == depNum) item.Sel = selVal });
    //$("#grid_forecast_deps").data("kendoGrid").setDataSource(data);
}
function ForeCastDepsOk() {
    var data = $("#grid_forecast_deps").data("kendoGrid").dataSource;
    var deps = [];
    var hasNot = false;
    data.data().forEach(function (item) { if (item.Sel) deps.push(item.Num); else hasNot = true; });   

    if (hasNot && deps.length > 0) {
        var depsOther = $("#forecast_deps_other").val().trim().split(",");
        depsOther.forEach(function (item) {
            if (item != null) {
                var txt = item.trim();
                if (item.length > 0 && !isNaN(item)) {
                    deps.push(item);
                }
            }});
        $("#forecast_deps").val(deps.join(','));
    }
    else
        $("#forecast_deps").val("Все");
}







function ForeCastCGSSelectDims() {
    var data = $("#grid_forecast_cass_groups").data("kendoGrid").dataSource;
    data.data().forEach(function (item) { item.Sel = (item.DimUse != null) });
    $("#grid_forecast_cass_groups").data("kendoGrid").setDataSource(data);
}
function ForeCastCGDeselectAll() {
    var data = $("#grid_forecast_cass_groups").data("kendoGrid").dataSource;
    data.data().forEach(function (item) { item.Sel = false });
    $("#grid_forecast_cass_groups").data("kendoGrid").setDataSource(data);
}
function ForeCastCGSelectAll() {
    var data = $("#grid_forecast_cass_groups").data("kendoGrid").dataSource;
    data.data().forEach(function (item) { item.Sel = false });
    $("#grid_forecast_cass_groups").data("kendoGrid").setDataSource(data);

    $("#window_forecast_cass_groups").data("kendoWindow").center().close();
}
function ForeCastCGSet(grNum) {
    var data = $("#grid_forecast_cass_groups").data("kendoGrid").dataSource;
    var selVal = $("#grid_forecast_cass_groups_" + String(grNum)).is(":checked");
    data.data().forEach(function (item) { if (item.Num == grNum) item.Sel = selVal });
    //$("#grid_forecast_deps").data("kendoGrid").setDataSource(data);
}

function ForeCastCGOk() {
    var data = $("#grid_forecast_cass_groups").data("kendoGrid").dataSource;
    var cgs = [];
    var hasNot = false;
    data.data().forEach(function (item) { if (item.Sel) cgs.push(item.Num); else hasNot = true; });

    if (hasNot && cgs.length > 0) {
        $("#forecast_cass_groups").val(cgs.join(','));
    }
    else
        $("#forecast_cass_groups").val("Все");
}





function ShowMenuDim(docNum, showDim) {
    var grid = $("#grid_forecast_mnu_dim").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_forecast_mnu_dim").remove();

    var data_source = [];
    var doc;
    if (showDim) {
        doc = Dims.filter(_doc => _doc.cod_dim == docNum)[0];
        $("#window_forecast_mnu_dim").data("kendoWindow").title("ДиМ");
        var data = $("#grid_forecast").data("kendoGrid").dataSource;
        data.data().forEach(function (item) {
            if (item.Oper != null) {
                var srcs = item.Oper.filter(_src => _src.src != "M" && _src.num_doc == docNum);
                srcs.forEach(function (src) {
                    var data = new Object();
                    data.LocCode = item.Barcod;
                    data.Name = item.Name;
                    data.Price = src.price;
                    data.Oper = GetOperName(src.src);
                    data.Shops = src.shops != null ? src.shops.join(',') : "";
                    data_source.push(data);
                });
            }
        });
    }
    else {
        doc = Mnu.filter(_doc => _doc.num_nakl == docNum)[0];
        $("#window_forecast_mnu_dim").data("kendoWindow").title("Меню");
        var data = $("#grid_forecast").data("kendoGrid").dataSource;
        data.data().forEach(function (item) {
            if (item.Oper != null) {
                var srcs = item.Oper.filter(_src => _src.src == "M" && _src.num_doc == docNum);
                srcs.forEach(function (src) {
                    var data = new Object();
                    data.LocCode = item.Barcod;
                    data.Name = item.Name;
                    data.Price = src.price;
                    data_source.push(data);
                });
            }
        });
    }
    $("#forecast_mnu_dim_ndoc").val(showDim ? doc.cod_dim : doc.num_nakl);
    $("#forecast_mnu_dim_name").val(showDim ? doc.name_dim : doc.name_doc);
    $("#forecast_source_mnu_dim_date").val(kendo.toString(kendo.parseDate(showDim ? doc.dt_dim : doc.dt_nakl, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy'));
    $("#forecast_source_mnu_dim_oper").val(showDim ? doc.oper : "-");
    $("#forecast_source_mnu_dim_com").val(showDim ? doc.comment : "-");
    $("#forecast_source_mnu_dim_vers").val(showDim ? doc.dim2v : "-");
    $("#forecast_source_mnu_dim_comv").val(showDim ? doc.comment2 : "-");

    $("#cassgr_mnu_dim").empty();
    var showCassGrWarning = ($("#forecast_cass_groups").val().toLowerCase() != "все");
    if (showCassGrWarning) {
        $("#cassgr_mnu_dim").append('<p style="color: red">ВНИМАНИЕ! Документ может быть отображаться не полностью, показаны  <br />только кассовые группы: ' + $("#forecast_cass_groups").val().replaceAll(",",", ") + '</p>');
        $("#cassgr_mnu_dim").css("display", "block");
    }
    else
        $("#cassgr_mnu_dim").css("display", "none");
    $("box_forecast_mnu_dim").css("height", String(600 - (showCassGrWarning ? 50 : 0)) + "px")

    $("#box_forecast_mnu_dim").append("<div id='grid_forecast_mnu_dim'></div>");
    $("#grid_forecast_mnu_dim").kendoGrid({
        /*toolbar: ["excel"],*/
        columns: [{
            field: "LocCode",
            title: "Баркод",
            width: "100px",
            template: function (dataItem) {
                return (MnuDimLightedBarcod != dataItem.LocCode) ? dataItem.LocCode : ("<b>" + String(dataItem.LocCode) + "</b>");
            }
        }, {
            field: "Name",
            title: "Название",
            template: function (dataItem) {
                return (MnuDimLightedBarcod != dataItem.LocCode) ? dataItem.Name : ("<b>" + String(dataItem.Name) + "</b>");
            }
            }, {
                field: "Price",
                title: "Цена",
            width: "70px",
            template: function (dataItem) {
                return (MnuDimLightedBarcod != dataItem.LocCode) ? dataItem.Price : ("<b>" + String(dataItem.Price) + "</b>");
            }
            },{
            field: "Oper",
            title: "Опер.",
            width: "70px",
            hidden: !showDim,
            template: function (dataItem) {
                return (MnuDimLightedBarcod != dataItem.LocCode) ? dataItem.Oper : ("<b>" + String(dataItem.Oper) + "</b>");
            }
        }, {
            field: "Shops",
            title: "Подр.",
            width: "100px",
            hidden: !showDim,
            template: function (dataItem) {
                return (MnuDimLightedBarcod != dataItem.LocCode) ? dataItem.Shops : ("<b>" + String(dataItem.Shops) + "</b>");
            }
        }],
        sortable: true,
        height: 605 - (showCassGrWarning ? 50 : 0),
        resizable: true,
        navigatable: true,
        dataSource: data_source
    });

    $("#grid_forecast_mnu_dim").data("kendoGrid").dataSource.sort({ field: "LocCode", dir: "asc" });
    $("#grid_forecast_mnu_dim").data("kendoGrid").dataSource.read();

    $("#window_forecast_mnu_dim").data("kendoWindow").center().open();
}


function LoadForecastPrevValues() {

    if ($("#grid_forecast").data("kendoGrid") == null) {
        alert("Загрузите таблицу");
        return;
    }

    if (!confirm("При первой загрузке (за новый месяц) операция может занять длительное время (до 20 минут). Продоложить?")) {
        return;
    }

    var shops = [];
    var barCodes = [];

    var data = $("#grid_forecast").data("kendoGrid").dataSource;
    data.data().forEach(function (item) {
        if (item.Barcod != null && barCodes.indexOf(item.Barcod) == -1)
            barCodes.push(item.Barcod);
    });

    var columns = $("#grid_forecast").data("kendoGrid").columns;
    columns.forEach(function (item) {
        if (item.field.slice(0,2) == "C_")
            shops.push(Number(item.field.slice(2)));
    });

    var send_data = {
        MonthMinus: 1,
        Shops: shops,
        BarCodes: barCodes
    };

    //


    WaitShow("forecast");

    $.ajax({
        url: "https://" + host + complaints + "/api/Info/GetForecastPrevValues",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(send_data),
        success: function (dataResp) {
            WaitHide("forecast", null);

            dataResp.BarCodes.forEach(function (itemRes) {
                var barCode = Number(itemRes.bar_cod);
                var value = Number(itemRes.value);
                if (value != 0) {
                    var items = [];
                    var hasDim = false;
                    var hasNum = false;
                    data.data().forEach(function (item) {
                        if (item.Barcod != null && item.Barcod == barCode) {
                            item.PrevValue = value;
                            if (item.Oper.filter(_op => _op.src == "I" || _op.src == "O" || _op.src == "C").length > 0)
                                hasDim = true;
                            if (!isNaN(item.Forecast))
                                hasNum = true;
                            items.push(item);
                        }
                    });

                    if (!hasDim && !hasNum)
                        items.forEach(function (item) { item.Forecast = value; });
                }
            });
            $("#grid_forecast").data("kendoGrid").setDataSource(data);
        },
        error: function () {
            WaitHide("forecast", "Произошла ошибка при загрузке списка значений");
        }
    });
}





function showSalesByDeps(barcod) {

    var filtersGet = "CodGood=" + String(barcod);

    var shops = [];
    var columns = $("#grid_forecast").data("kendoGrid").columns;
    columns.forEach(function (item) {
        if (item.field.slice(0, 2) == "C_")
            shops.push(Number(item.field.slice(2)));
    });
    filtersGet += "&CodShop=" + shops.join(',');


    $.ajax({
        url: "https://" + host + complaints + "/api/Info/GetSalesByDeps?" + filtersGet,
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {

                var monthMinus = new Date();
                var prevMonth = monthMinus.getMonth() - 1;
                prevMonth = (prevMonth >= 0 ? prevMonth : 11);
                PrepareSalesByDepsData(data, barcod, months[prevMonth])

            } else {
                onExit();
            }
        }
    });

}

function PrepareSalesByDepsData(data, barcod, monthName) {

    var data_source = [];

    var sum = 0;
    data.forEach(function (item, idx) {
        var dep = DepartmentList.filter(_dep => _dep.DepNum == item.shop);

        var obj = new Object();
        obj["Dep"] = item.shop;
        obj["Name"] = (dep.length > 0 ? dep[0].DepName : "");
        obj["Sales"] = item.value;
        sum = sum + item.value;
        data_source.push(obj);
    });

    var obj = new Object();
    obj["Name"] = "ВСЕ";
    obj["Sales"] = sum;
    data_source.unshift(obj);

    $("#box_forecast_sales_bydeps").append("<div id='grid_forecast_sales_bydeps'></div>");
    $("#grid_forecast_sales_bydeps").kendoGrid({
        /*toolbar: ["excel"],*/
        columns: [{
            field: "Dep",
            title: "№ подр.",
            width: "100px"
        }, {
            field: "Name",
            title: "Название"
        }, {
            field: "Sales",
            title: "Продажи",
            width: "170px"
        }],
        sortable: true,
        height: 600,
        resizable: true,
        navigatable: true,
        dataSource: data_source
    });

    $("#window_forecast_sales_bydeps").data("kendoWindow").title("Продажи за " +barcod+ " за " + monthName);

    $("#window_forecast_sales_bydeps").data("kendoWindow").center().open();
}











function CalcForecastCalc() {

    if (File == null || (File != null && File.createdMenu && !File.savedMenu)) {
        if (!confirm("Для расчета ингридиентов необходимо сохранить прогноз. Продолжить?"))
            return;
    }

    if ($("#grid_forecast").data("kendoGrid").dataSource.data.length == 0) {
        alert("Нету данных для расчета в таблице Прогноз по меню");
        return;
    }


    var emptyRows = [];
    $("#grid_forecast").data("kendoGrid").dataSource.data().forEach(function (item) {
        if (item.Barcod) {
            if (item.Forecast == null && (item.PrevValue != null || (item.Oper.filter(_op => _op.src == "I" || _op.src == "O" || _op.src == "C").length > 0)))
                emptyRows.push(item.Barcod + " " + item.Name);
        }
    });
    if (emptyRows.length > 0) {
        alert("Перед расчетом введите значения в прогнозе по меню для позиций:\r\n" + emptyRows.join("\r\n"))
        return;
    }

    forecast_calc_start_time = new Date();
    
    var grid = $("#grid_forecast_calc").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_forecast_calc").remove();

    //var filtersGet = "RecipeMode=371";
    //var recipeMode = $("#forecast_calc_recipe_mode").val();
    //if (recipeMode != "") {
    //    filtersGet += "&RecipeMode=" + recipeMode;
    //}
    //else {
    //    alert("Выберите метод расчета по техкарте");
    //    return;
    //}



    




    WaitShow("forecast_calc");

    var barCodeForecasts = []

    var conceptDeps = [180, 205, 255];

    var depDefault = 371;

    var data = $("#grid_forecast").data("kendoGrid").dataSource;
    data.data().forEach(function (item) {
        if (item.Barcod != null && barCodeForecasts.filter(_bc => _bc.Bc == item.Barcod).length == 0)
            if (!isNaN(item.Forecast)) {
                var obj = { Bc: item.Barcod, Qn: item.Forecast };

                // Опередить специфичные блюда для концепций
                var shops = [];
                data.data().forEach(function (itm) {
                    if (itm.Barcod == item.Barcod) 
                        itm.Oper.forEach(function (oper) {
                            if (oper.src != "O") // Если блюдо на вывод - не считаем его в меню
                                oper.shops.forEach(function (sh) {
                                    // Если блюдо по АКЦИИ (200) и не в концептном ресторане - не считаем его в меню ToDo - спорный подход
                                    if (shops.indexOf(sh) == -1 && !(oper.cod_casgr == 200 && conceptDeps.indexOf(sh) == -1))
                                        shops.push(sh);
                                });
                        });
                });
                // В меню только концептного рестика - точно он
                if (shops.length == 1 && conceptDeps.indexOf(shops[0]) != -1) {
                    obj.Dep = shops[0];
                }
                else {
                    // Если есть в дефолтном, то не трогаем
                    // Если нет в дефолтном, но есть в концептном, то присваиваем концептный
                    var concDeps = shops.filter(_sh => conceptDeps.indexOf(_sh) != -1);
                    if (shops.indexOf(depDefault) == -1 && concDeps.length > 0)
                        obj.Dep = concDeps[0];
                }
                
                barCodeForecasts.push(obj);
            }
    });

    var send_data = {
        RecipeMode: depDefault,
        MonthMinus: 1,
        MaxRecipeBindingDate: $("#datepicker_forecast_calc_recipe_bind_max").val(),
        ForecastDate: kendo.toString(new Date(), 'dd/MM/yyyy'),
        BarCodeForecasts: barCodeForecasts
    };


    $.ajax({
        url: "https://s2010/complaints/api/info/GetForecastCalculation",
        global: false,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(send_data),
        success: function (data) {
            if (typeof (data) == "object") {
                WaitHide("forecast_calc", null);

                PrepareDataForecastCalc(data)
            };
        },
        error: function () {
            WaitHide("forecast_calc", "Произошла ошибка при загрузке расчета ингридиентов");
        }
    })


}













function PrepareDataForecastCalc(data) {


    var diffDateSec = (new Date() - forecast_calc_start_time) / 1000;

    $("#forecast_calc_elapsed_time").val(kendo.toString(Math.floor(diffDateSec / 60), "00") + ":" + kendo.toString(diffDateSec % 60, "00"));

    $("#forecast_calc_date_time").val(kendo.toString(new Date(), 'dd.MM.yyyy HH:mm'));
    
    var data_source = [];

    var monthMinus = new Date();
    var prevMonth = monthMinus.getMonth() - 1;
    prevMonth = (prevMonth >= 0 ? prevMonth : 11);

    data.Barcodes.forEach(function (item, idx) {       
        data_source.push({
            PrevValue: item.PrevValue,
            Forecast: item.Forecast,
            Barcode: item.Barcode,
            Name: item.Name,
            Unit: item.Unit,            
            Parents: item.Parents
            });
    });

    function excelexport(e) {
        var colFormats = [];
        $("#grid_forecast_calc").data("kendoGrid").columns.forEach(_col => {
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

    $("#box_forecast_calc").append("<div id='grid_forecast_calc'></div>"); 
    $("#grid_forecast_calc").kendoGrid({
        toolbar: ["excel"],
        excelExport: excelexport,
        excel: {
            allPages: true,
            fileName: "ForecastCalc.xlsx"
        },
        columns: [{
            field: "PrevValue",
            title: "За " + months[prevMonth],
            width: "100px"//,
            //template: function (dataItem) {
            //    return "<b>" + kendo.toString(dataItem.PrevValue, "0.00") + "</b>";
            //}
        },
            {
                field: "Forecast",
                title: "Прогноз",
                width: "100px",
                template: function (dataItem) {
                    return "<b>" + kendo.toString(dataItem.Forecast, "0.00") + "</b>";
                }
            },
            {
                field: "Unit",
                title: "Ед.",
                width: "70px",
                template: function (dataItem) {
                    return "<b>" + String(dataItem.Unit) + "</b>";
                }
            },
        {
            field: "Barcode",
            title: "Баркод",
            width: "110px"
        },
        {
            field: "Name",
            title: "Название",
            width: "400px"
        },
        {
            field: "Parents",
            title: "Источники",
            template: function (dataItem) {
                return "<span class='expandSrc'>" + String(dataItem.Parents.length) + " источников";//</span><span class='addToFilter'>В фильтры ↑</span>";
            }
        }
        ],
        sortable: true,
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source,

        
        detailTemplate: kendo.template($("#detail-template").html()),
        detailInit: detailInit,
        dataBound: function (e) {
            var grid = e.sender; 

            grid.tbody.find("tr.k-master-row").find("span.expandSrc").click(function (e) {
                var target = $(e.target).parent().parent();
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
        }
    });

    ////$("#grid_spis").data("kendoGrid").dataSource.sort({ field: "DateAkt", dir: "asc" });
    $("#grid_forecast_calc").data("kendoGrid").dataSource.sort(x => { x.Add(y => y.Barcode).Descending(); });
    $("#grid_forecast_calc").data("kendoGrid").dataSource.read();



}




function detailInit(e) {
    var detailRow = e.detailRow;

    var parStrs = [];
    e.data.Parents.forEach(function (item, idx) {
        var par = [];
        item.forEach(function (itm, idx, array) {
            var name = "";
            var titleMnus = "";
            if (idx == 0) {
                var shops = [];
                var barLoccode = null;
                if (array.length > 1 && array[0].RecipeNum == null) { barLoccode = array[1].Barcode; }
                $("#grid_forecast").data("kendoGrid").dataSource.data().forEach(function (itemName) {
                    if (itemName.Barcod == itm.Barcode || (itemName.Loccod != null && itemName.Loccod == itm.Barcode) || (barLoccode != null && itemName.Barcod == barLoccode)) {
                        name = " <i>" + itemName.Name + "</i>";
                        itemName.Oper.forEach(function (oper) {
                            oper.shops.forEach(function (sh) {
                                var op = GetOperName(oper.src);
                                var shop = String(sh) + (op != null ? ("(" + op + ")") : "");
                                if (shops.indexOf(shop) == -1) shops.push(shop);
                            }); 
                        });
                    }
                });
                titleMnus = " title='В ресторанах: " + shops.join(", ") + "'";
            }
            var isLast = ((array.length - 1) === idx);
            var isFirst = (idx == 0);
            var quanBold = (idx == 0 || isLast);
            par.push(
                "<div class='sCell'>"
                + (idx == 0 ? "<a style='cursor:pointer;color:DarkBlue;text-decoration: underline;' onclick='showSalesByDeps(" + itm.Barcode + ")'" + titleMnus+">" + String(itm.Barcode) + "</a>" : String(itm.Barcode))
                + name
                + (itm.RecipeNum != null ? (" <a style='cursor:pointer;color:DarkBlue;text-decoration: underline;' onclick='ShowCalculation(" + itm.Barcode + "," + itm.RecipeNum + ",\x22" + "" + "\x22)'>" + String(itm.RecipeNum) + "</a>") : "")
                + ((idx == 0) ? " Прогноз: " : " Кол-во: ")
                + ((itm.Quan1 != itm.Quan) ? ((isFirst ? "<b>" : "") + kendo.toString(itm.Quan1, itm.Quan1 > 1 ? "0.##" : "0.####") + (isFirst ? "</b>" : "") + "/") : (""))
                + ((isLast || (isFirst && itm.Quan1 == itm.Quan)) ? "<b>" : "") + kendo.toString(itm.Quan, itm.Quan > 1 ? "0.##" : "0.####") + ((isLast || (isFirst && itm.Quan1 == itm.Quan)) ? "</b>" : "")
                + (isLast ? e.data.Unit : "")
                + "</div>"
            );
        });
        //var str = item.filter(_pr => String(_pr.Barcode) + " Кол-во:" + String(_pr.Quan) + (_pr.RecipeNum != null ? (" " + String(_pr.RecipeNum)) : "")).join(" => ");
        parStrs.push("<div class='sLine'>"+par.join(" => ")+"</div>");
    });

    detailRow.find(".calcSources").html(parStrs.join(""));

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

function PrepareCalsData(data, author) {

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

    //$("#grid_technology").data("kendoGrid").dataSource.sort({ field: "field0", dir: "asc" });
    $("#grid_technology").data("kendoGrid").dataSource.read();

    $("#window_technology").data("kendoWindow").center().open();
}



function FileClear() {   
    $("#file_description").val("");

    $("#forecast_date_time").val("");
    $("#forecast_deps").val("Все");
    $("#forecast_cass_groups").val("Все");
    $("#datepicker_forecast_dim").data("kendoDatePicker").value(new Date());

    if ($("#grid_forecast").data("kendoGrid"))
        $("#grid_forecast").data("kendoGrid").setDataSource([]);

    FileClearCalc();

    hideMnuDimsDetails = true;
    Mnu = [];
    Dims = [];

    File = null;
}
function FileClearCalc() {
    var monthPlus = new Date();
    var nextMonth = monthPlus.setMonth(monthPlus.getMonth() + 1);
    $("#datepicker_forecast_calc_recipe_bind_max").data("kendoDatePicker").value(monthPlus);

    $("#forecast_calc_deps").val("");
    $("#forecast_calc_cass_groups").val("");
    $("#forecast_calc_elapsed_time").val("");
    $("#forecast_calc_date_time").val("");

    if ($("#grid_forecast_calc").data("kendoGrid"))
        $("#grid_forecast_calc").data("kendoGrid").setDataSource([]);
}

function FileCreate() {
    if (File != null && File.createdMenu && !File.savedMenu) 
        if (!confirm("Существующий прогноз не сохранен. При создании нового прогноза все несохраненные данные будут утеряны. Продолжить?"))
            return;
    FileClear();
}

function FileOpen() {
    if (File != null && File.createdMenu && !File.savedMenu)
        if (!confirm("Существующий прогноз не сохранен. При открытии другого прогноза все несохраненные данные будут утеряны. Продолжить?"))
            return;   

    var grid = $("#grid_forecast_files").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_forecast_files").remove();

    $.ajax({
        url: "https://s2010/complaints/api/info/GetForecastFiles?OnlyNames=false",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {
                FileListPrepareData(data);
            };
        }
    })
}
function FileListPrepareData(data_source) {
    $("#box_forecast_files").append("<div id='grid_forecast_files'></div>");
    $("#grid_forecast_files").kendoGrid({
        /*toolbar: ["excel"],*/
        columns: [{
            field: "Id",
            title: "Id",
            hidden: true
        }, {
            field: "Name",
            title: "Название"
        }, {
            field: "CreateDate",
            title: "Дата создания",
            width: "110px",
            template: function (dataItem) {
                return kendo.toString(kendo.parseDate(dataItem.CreateDate, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy');//ShowCalculation(barCode, numAkt)
            }
        }, {
            field: "Creator",
            title: "Создатель",
            width: "110px"
        }, {
            field: "ChangeDate",
            title: "Дата правки",
            width: "110px",
            template: function (dataItem) {
                return kendo.toString(kendo.parseDate(dataItem.ChangeDate, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy');//ShowCalculation(barCode, numAkt)
            }
        }, {
            field: "Changer",
            title: "Правил",
            width: "110px"
        }],
        sortable: true,
        height: 500,
        resizable: true,
        selectable: "row",
        dataSource: data_source
    });

    //$("#grid_technology").data("kendoGrid").dataSource.sort({ field: "field0", dir: "asc" });
    $("#grid_forecast_files").data("kendoGrid").dataSource.read();

    $("#window_forecast_files").data("kendoWindow").center().open();
}
function FileOpenOkClick() {
    var grid = $("#grid_forecast_files").data("kendoGrid");
    var selectedItem = grid.dataItem(grid.select());

    if (selectedItem != null) {
        $("#window_forecast_files").data("kendoWindow").center().close();
        FileClear();
        $.ajax({
            url: "https://s2010/complaints/api/info/GetForecast?Id=" + String(selectedItem.Id),
            global: false,
            type: "GET",
            success: function (data) {
                if (typeof (data) == "object") {
                    FileOpenPrepareData(data);
                };
            }
        })
    }
}

function FileOpenPrepareData(data) {
}

function CheckFreeFileName(fileName) {
    $.ajax({
        url: "https://s2010/complaints/api/info/GetForecastFiles?Count=-1&OnlyNames=true",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {
                var lowerNames = [];
                data.forEach(function (name) { lowerNames.push(name.toLowerCase()); });
                if (fileName != null && fileName.trim() != "" && lowerNames.indexOf(fileName.toLowerCase()) == -1) {
                    FileSave(fileName);
                }
                else {
                    var newVal = prompt("Введите уникальное имя файла", fileName);
                    if (newVal !== null)
                        CheckFreeFileName(newVal);
                }
            };
        }
    })
}

function FileSave(fileName) {
    //if (fileName == null) {
    //    CheckFreeFileName();
    //    return;
    //}
    if (File == null) {
        FileSaveAs(fileName);
    }
    else {
        FileSaveSend(File.Id, File.Name);
    }
}

function FileSaveAs(fileName) {
    if (fileName == null) {
        CheckFreeFileName();
        return;
    }
    FileSaveSend(null, fileName);
}


function FileSaveSend(id, name) {
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



