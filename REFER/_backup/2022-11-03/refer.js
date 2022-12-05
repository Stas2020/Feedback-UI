
var DepartmentList = [];
var PositionList = [];
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

var userCanChangeData = false;
var userCanChangeOnlyStaffTableData = false;
var userCanChangeOnlyDecret = false;
var userCanChangeOnlyVacations = false;

var EqTypes = [];
var CheckLists = [];
var Reports = [];
//var Months = ["Янв.", "Фев.", "Март", "Апр.", "Май ", "Июнь", "Июль", "Авг.", "Сен.", "Окт.", "Ноя.", "Дек."]
var Months = ["Январь", "Февраль", "Март", "Апрель", "Май ", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]

class ReportNow {
    type;// R-rep C-checklist S-string custom name
    id;//for string is name
    isPercent;
    defEqualsType;
    constructor(type, id, isPercent, defEqualsType) {
        this.type = type;
        this.id = id;
        this.isPercent = isPercent;
        this.defEqualsType = defEqualsType;
    }
}
var repNow = null;
var repManNow = null;


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

        $("#Button_DK_save").kendoButton({
            click: onDKSave
        });

        $("#Button_pah_ref_save").kendoButton({
            click: onPahRefSave
        });

        $( "#password" ).keypress(function(event) {
            if (event.keyCode === 13) {
                onLogin();
            }
        });


        var _today = new Date();
        var _priorDate = new Date(new Date().setDate(_today.getDate()));


        $("#writeoff_refers_rep_types").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [],
            change: function (e) {
                RefreshWriteoffRefers();
            }
        });
        $("#outer_refers_rep_types").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [],
            change: function (e) {
                RefreshOuterRefers();
            }
        });
        $("#outer_refers_month").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: [],
            change: function (e) {
                RefreshOuterRefers();
            }
        });
        //$("#staff_turnover_month").kendoComboBox({
        //    dataTextField: "text",
        //    dataValueField: "value",
        //    dataSource: []
        //});
        //$("#staff_turnover_deps").kendoComboBox({
        //    dataTextField: "text",
        //    dataValueField: "value",
        //    dataSource: []
        //});
        $("#pah_ref_dep").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#pah_ref_place").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#pah_ref_month").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#pah_ref_eq_type").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#staff_vacation_dep").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });

        $("#datepickerstart_staff_turnover").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerstart_staff_turnover").data("kendoDatePicker").value(_today);

        $("#datepickerend_staff_turnover").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerend_staff_turnover").data("kendoDatePicker").value(_today);

        $("#datepickerstart_staffvacation").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerend_staffvacation").kendoDatePicker({ format: "dd/MM/yyyy" });

        $("#datepickerstart_staffvacation").data("kendoDatePicker").value(_today);
        $("#datepickerend_staffvacation").data("kendoDatePicker").value(_today);

        var window_login = $("#window_login")
        window_login.kendoWindow({
            actions: {},
            width: "400px",
            height: "170px",
            modal: true,
            resizable: false,
            title: "Авторизироваться",
            visible: false,
            open: adjustSize
        });

        $("#window_login").data("kendoWindow").center().open();

        var window_dish_koeff_edit = $("#window_dish_koeff_edit")
        window_dish_koeff_edit.kendoWindow({
            actions: ["Close"],
            width: "220px",
            height: "170px",
            modal: true,
            resizable: false,
            title: "Создать",
            visible: false,
            open: adjustSize,
            activate: function () {
                $("#dish_koeff_value").select();
            }
        });

        $("#dish_koeff_value").keydown(function (e) {
            if (e.keyCode === 13) {
                onDKSave();
            }
        });

        var window_pah_ref_edit = $("#window_pah_ref_edit")
        window_pah_ref_edit.kendoWindow({
            actions: ["Close"],
            width: "340px",
            height: "264px",
            modal: true,
            resizable: false,
            title: "Создать",
            visible: false,
            open: adjustSize
        });


        
        var window_staffturnover_deps = $("#window_staffturnover_deps")
        window_staffturnover_deps.kendoWindow({
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
        $("#window_staffturnover_deps").data("kendoWindow")
            .bind("close", function (e) {
                StaffTurnoverDepsOk();
            });

        var window_staffvacation_dates = $("#window_staffvacation_dates")
        window_staffvacation_dates.kendoWindow({
            actions: ["Close"],
            width: "400px",
            height: "170px",
            modal: true,
            resizable: false,
            title: "Период",
            visible: false,
            open: adjustSize
        });
    });

function adjustSize()
{
    if ($(window).width() < 1000 || $(window).height() < 600) { this.maximize(); }
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

                    //$("#context-menu-prtype").kendoContextMenu({
                    //    target: "#setPrType"
                    //});
                    //var contextMenu = $("#context-menu-prtype").data("kendoContextMenu");
                    //contextMenu.bind("open", function (e) {
                    //});


                    if (user_id != 10 && user_id != 2107 && user_id != 1089 && user_id != 1065 /*&& user_id != 8*/) // Костыль - создать роль/функцию для редактирования данных
                    {
                        userCanChangeData = false;
                        if (user_id != 2138 && user_id != 2139 && user_id != 2140) {
                            userCanChangeOnlyStaffTableData = false;
                            userCanChangeOnlyDecret = false;
                            userCanChangeOnlyVacations = false;
                            $("#warning_no_access").css("display", "block");
                        }
                        else {
                            userCanChangeOnlyStaffTableData = true;
                            userCanChangeOnlyDecret = true;
                            userCanChangeOnlyVacations = true;
                            $("#warning_no_access").css("display", "none");
                        }
                    }
                    else {
                        userCanChangeData = true;
                        userCanChangeOnlyStaffTableData = true;
                        userCanChangeOnlyDecret = true;
                        userCanChangeOnlyVacations = true;
                        $("#warning_no_access").css("display", "none");
                    }



                    RoleUser.CheckLists = data.CheckLists;

                    $("#window_login").data("kendoWindow").center().close();
                    $("#login-message").text("");


                    $("#tabs").css("display", "");
                    $("#tab-content").css("display", "block");


                    var places = [];
                    places.push({ value: "Город", text: "Город" });
                    places.push({ value: "Домодедово", text: "Аэропорт" });
                    $("#pah_ref_place").data("kendoComboBox").setDataSource(places);



                    {
                        var months = [];
                        var dt = new Date();
                        dt.setMonth(dt.getMonth() + 11)
                        months.push({ value: kendo.toString(dt, '01/MM/yyyy'), text: Months[Number(kendo.toString(dt, 'MM')) - 1] + " " + kendo.toString(dt, 'yyyy') })
                        for (var i = 1; i <= 24; i++) {
                            dt.setMonth(dt.getMonth() - 1)
                            months.push({ value: kendo.toString(dt, '01/MM/yyyy'), text: Months[Number(kendo.toString(dt, 'MM')) - 1] + " " + kendo.toString(dt, 'yyyy') })
                        }
                        dt = new Date();
                        $("#outer_refers_month").data("kendoComboBox").setDataSource(months);
                        //$("#outer_refers_month").data("kendoComboBox").text(Months[Number(kendo.toString(dt, 'MM')) - 1] + " " + kendo.toString(dt, 'yyyy'));
                        $("#outer_refers_month").data("kendoComboBox").value(kendo.toString(dt, '01/MM/yyyy'));

                        var monthsPrev = [];
                        var dt = new Date();
                        monthsPrev.push({ value: kendo.toString(dt, '01/MM/yyyy'), text: Months[Number(kendo.toString(dt, 'MM')) - 1] + " " + kendo.toString(dt, 'yyyy') })
                        for (var i = 1; i <= 24; i++) {
                            dt.setMonth(dt.getMonth() - 1)
                            monthsPrev.push({ value: kendo.toString(dt, '01/MM/yyyy'), text: Months[Number(kendo.toString(dt, 'MM')) - 1] + " " + kendo.toString(dt, 'yyyy') })
                        }

                        //$("#staff_turnover_month").data("kendoComboBox").setDataSource(monthsPrev);
                        var dtPrevMonth = new Date(dt)
                        //dtPrevMonth.setMonth(dtPrevMonth.getMonth() - 1)
                        //$("#staff_turnover_month").data("kendoComboBox").value(kendo.toString(dtPrevMonth, '01/MM/yyyy'));
                    }

                    {
                        var months = [];
                        var dt = new Date();
                        dt.setMonth(dt.getMonth() - 2)
                        months.push({ value: kendo.toString(dt, '01/MM/yyyy'), text: Months[Number(kendo.toString(dt, 'MM')) - 1] + " " + kendo.toString(dt, 'yyyy') })
                        for (var i = 1; i <= 7; i++) {
                            dt.setMonth(dt.getMonth() + 1)
                            months.push({ value: kendo.toString(dt, '01/MM/yyyy'), text: Months[Number(kendo.toString(dt, 'MM')) - 1] + " " + kendo.toString(dt, 'yyyy') })
                        }
                        //months.push({ value: kendo.toString(dt.setMonth(dt.getMonth() - 1), '01/MM/yyyy'), text: kendo.toString(dt.setMonth(dt.getMonth() - 1), 'MM.yyyy') })
                        //months.push({ value: kendo.toString(dt, '01/MM/yyyy'), text: kendo.toString(dt, 'MM.yyyy') })
                        //months.push({ value: kendo.toString(dt.setMonth(dt.getMonth() + 1), '01/MM/yyyy'), text: kendo.toString(dt.setMonth(dt.getMonth() + 1), 'MM.yyyy') })
                        //months.push({ value: kendo.toString(dt.setMonth(dt.getMonth() + 2), '01/MM/yyyy'), text: kendo.toString(dt.setMonth(dt.getMonth() + 2), 'MM.yyyy') })
                        //months.push({ value: kendo.toString(dt.setMonth(dt.getMonth() + 3), '01/MM/yyyy'), text: kendo.toString(dt.setMonth(dt.getMonth() + 3), 'MM.yyyy') })
                        //months.push({ value: kendo.toString(dt.setMonth(dt.getMonth() + 4), '01/MM/yyyy'), text: kendo.toString(dt.setMonth(dt.getMonth() + 4), 'MM.yyyy') })
                        //months.push({ value: kendo.toString(dt.setMonth(dt.getMonth() + 5), '01/MM/yyyy'), text: kendo.toString(dt.setMonth(dt.getMonth() + 5), 'MM.yyyy') })
                        $("#pah_ref_month").data("kendoComboBox").setDataSource(months);
                    }

                    getAllData();

                }
                }
             else {
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
    $("#tabs").css("display", "none");
    $("#tab-content").css("display", "none");

    var grid_dish_koefs = $("#grid_dish_koefs").data("kendoGrid");
    if (grid_dish_koefs) {
        grid_dish_koefs.destroy();
    }
    var grid_writeoff_refers = $("#grid_writeoff_refers").data("kendoGrid");
    if (grid_writeoff_refers) {
        grid_writeoff_refers.destroy();
    }
    var grid_staff_decret = $("#grid_staff_decret").data("grid_staff_decret");
    if (grid_staff_decret) {
        grid_staff_decret.destroy();
    }

    $("#datepickerstart_staffvacation").data("kendoDatePicker").destroy();
    $("#datepickerend_staffvacation").data("kendoDatePicker").destroy();
    $("#datepickerstart_staff_turnover").data("kendoDatePicker").destroy();
    $("#datepickerend_staff_turnover").data("kendoDatePicker").destroy();
    $("#writeoff_refers_rep_types").data("kendoComboBox").destroy();
    $("#outer_refers_rep_types").data("kendoComboBox").destroy();
    $("#outer_refers_month").data("kendoComboBox").destroy();
    //$("#staff_turnover_month").data("kendoComboBox").destroy();
    //$("#staff_turnover_deps").data("kendoComboBox").destroy(); 
    $("#pah_ref_dep").data("kendoComboBox").destroy();
    $("#pah_ref_place").data("kendoComboBox").destroy();
    $("#pah_ref_month").data("kendoComboBox").destroy();
    $("#pah_ref_eq_type").data("kendoComboBox").destroy();
    $("#staff_vacation_dep").data("kendoComboBox").destroy();
}

function getAllData() {
    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetEqualTypes",
        global: false,
        type: "GET",
        success: function (data) {
            var tttt = typeof (data);
            if (typeof (data) == "object") {
                EqTypes = data

                var eTypes = EqTypes.map(function (_et) { return { value: _et.Id, text: _et.Note }; });
                $("#pah_ref_eq_type").data("kendoComboBox").setDataSource(eTypes);

                getCheckLists();
            }
            else
                onExit();
        }
    });

}

function getCheckLists() {
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
                getDepartments();
            } else {
                onExit();
            }
        }
    });
}

function getDepartments() {
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

                var deps = DepartmentList.filter(_dep => _dep.isActive);
                var depsWithAll = []
                deps.sort(function (a, b) { return a.DepNum - b.DepNum; });
                depsWithAll = deps.map(function (_dep) { return { value: _dep.DepNum, text: String(_dep.DepNum) + " " + _dep.DepName }; });
                depsWithAll.unshift({ value: "ALL", text: "Все подразделения" })
                deps = deps.map(function (_dep) { return { value: _dep.DepId, text: String(_dep.DepNum) + " " + _dep.DepName }; });
                $("#pah_ref_dep").data("kendoComboBox").setDataSource(deps);

                $("#staff_vacation_dep").data("kendoComboBox").setDataSource(depsWithAll);
                //$("#staff_turnover_deps").data("kendoComboBox").setDataSource(depsWithAll)

                getReportTypes();
            } else {
                onExit();
            }
        }
    });
}

function getReportTypes() {
    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetReportsTypes",
        global: false,
        type: "GET",
        success: function (data) {
            var tttt = typeof (data);
            if (typeof (data) == "object") {
                Reports = data;

                getCustomNames();
            } else {
                onExit();
            }
        }
    });

}

function getCustomNames() {
    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetReferenceCustomNames",
        global: false,
        type: "GET",
        success: function (data) {
            var tttt = typeof (data);
            if (typeof (data) == "object") {
                var reps = [];

                Reports.forEach(function (item) {
                    if (item.Id != 8)
                        reps.push({ value: "R" + String(item.Id), text: item.Caption });
                });
                //CheckLists.forEach(function (item) {
                //    reps.push({ value: "C" + String(item.CheckListId), text: item.CheckListName });
                //});
                data.forEach(function (item) {
                    reps.push({ value: "S"+item, text: item });
                });

                reps.sort(function (a, b) { return a.text - b.text; });
                $("#writeoff_refers_rep_types").data("kendoComboBox").setDataSource(reps);

                getReportManualTypes()
            } else {
                onExit();
            }
        }
    });

}



function getReportManualTypes() {
    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetReportsTypes?OnlyManual=true",
        global: false,
        type: "GET",
        success: function (data) {
            var tttt = typeof (data);
            if (typeof (data) == "object") {

                var reps = [];
                data.forEach(function (item) {
                    if (item.Id != 8)
                        reps.push({ value: item.Id, text: item.Caption });
                });
                reps.sort(function (a, b) { return a.text - b.text; });
                $("#outer_refers_rep_types").data("kendoComboBox").setDataSource(reps);

                RefreshDishKoefs();
                RefreshRestWorkTime();
                RefreshStaffing();
                RefreshQuotas();

            } else {
                onExit();
            }
        }
    });

}




// ***** Отрисовка гридов


function RefreshDishKoefs() {

    var grid = $("#grid_dish_koefs").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_dish_koefs").remove();

    WaitShow("dish_koefs");

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetDishCoefficients",
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("dish_koefs", null);
            if (typeof (data) == "object") {
                PrepareData(data)
            };
        },
        error: function () {
            WaitHide("dish_koefs", "Произошла ошибка при загрузке списка коэффициентов блюд");
        }
    })


}


function PrepareData(data_source) {
    //var data_source = [];

    function excelexport(e) {
        ;
    }

    $("#box_dish_koefs").append("<div id='grid_dish_koefs'></div>");
    $("#grid_dish_koefs").kendoGrid({
        toolbar: ["excel",
            {
                name: "add",
                text: "Добавить",
                template: '<a class="k-button"' + (!userCanChangeData ? ' style="text-decoration: line-through"' : '') + '" href="\\#" onclick="AddDishKoef()">' + symbolPlus+' Добавить</a>'
            },
            {
                name: "edit",
                text: "Редактировать",
                template: '<a class="k-button"' + (!userCanChangeData ?' style="text-decoration: line-through"':'') + '" href="\\#" onclick="EditDishKoef()">' + symbolEdit + ' Редактировать</a>'
            }
        ],
        excelExport: excelexport,
        excel: {
            allPages: true,
            fileName: "DishesKissTheCook.xlsx"
        },
        columns: [{
            field: "Barcode",
            title: "Баркод",
                width: "100px"
        }, {
            field: "Name",
                title: "Название"
            },
            {
                field: "Value",
                title: "Значение",
                width: "100px"
            }, {
                field: "Delete",
                title: "Удал.",
                width: "65px",
                template: function (dataItem) {
                    return "<button class='k-primary k-button' style='width:30px;min-width:30px' onclick='DeleteDishKoef(" + dataItem.Barcode + ")'>" + symbolDelete + "</button>";
                },
                hidden : !userCanChangeData
            }],
        selectable: "row",
        sortable: true,
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source,
        dataBound: function (e) {
            if (userCanChangeData) {
                var grid = this;
                grid.tbody.find("tr").dblclick(function (e) {
                    var dataItem = grid.dataItem(this);
                    EditDishKoef()
                });
            }
        }   
    });

    $("#grid_dish_koefs").data("kendoGrid").dataSource.sort({ field: "Barcod", dir: "asc" });
    $("#grid_dish_koefs").data("kendoGrid").dataSource.read();
}






////////////////////////////////////////////////////////////////////////////////// prih



function RefreshWriteoffRefers() {

    var rep = $("#writeoff_refers_rep_types").data("kendoComboBox").value();

    if (rep == "" || rep == null) {
        alert("Выберите отчет");
        return;
    }

    var send_data = null;
    var rep_type = rep.slice(0, 1);
    var rep_type_val = rep.slice(1);
    var filtersGet = "";
    if (rep_type == "R")
        filtersGet = "ReportId=" + String(rep_type_val);
    if (rep_type == "C")
        filtersGet = "CheckListId=" + String(rep_type_val);
    if (rep_type == "S") {
        send_data = rep_type_val;
    }

    repNow = null;

    var grid = $("#grid_writeoff_refers").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_writeoff_refers").remove();

    WaitShow("writeoff_refers");

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetReferenceValues?" + filtersGet,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(send_data),
        success: function (data) {
            WaitHide("writeoff_refers", null);
            if (typeof (data) == "object") {
                PrepareDataRefers(data, rep_type, rep_type_val)
            };
        },
        error: function () {
            WaitHide("writeoff_refers", "Произошла ошибка при загрузке референсных значений");
        }
    })


}


function PrepareDataRefers(data, repType, repTypeVal, selectedId) {
    var data_source = [];    

    var isPercent = false;

    var rep = (repType == "R") ? Reports.filter(_rep => _rep.Id == repTypeVal):[];
    if (rep.length > 0)
        isPercent = (rep[0].Format.indexOf("%") != -1);

    var eqType = null;
    data.forEach(function (item, idx) { eqType = item.EqualTypeId; });

    repNow = new ReportNow(repType, repTypeVal, isPercent, eqType);

    data.sort(function (a, b) { return b.MonthDate - a.MonthDate; });

    data.forEach(function (item, idx) {

        var colName = "Prior" + String(item.Prior)
        item["IsPercent"] = isPercent;
        var inserted = false;
        data_source.forEach(function (row, idx) {
            if (!inserted && row[colName] == null) {
                row[colName] = item;
                inserted = true;
            }
        });
        if (!inserted) {
            var obj = new Object();
            obj[colName] = item;
            data_source.push(obj);
        }
    });
    if (data_source.length == 0)
        data_source.push({});


    function excelexport(e) {
    }

    $("#box_writeoff_refers").append("<div id='grid_writeoff_refers'></div>");
    $("#grid_writeoff_refers").kendoGrid({
        toolbar: ["excel",
            {
                name: "add",
                text: "Добавить",
                template: '<a class="k-button"' + (!userCanChangeData ? ' style="text-decoration: line-through"' : '') + '" href="\\#" onclick="AddPahRef()">' + symbolPlus + ' Добавить</a>'
            },
            {
                name: "edit",
                text: "Редактировать",
                template: '<a class="k-button"' + (!userCanChangeData ? ' style="text-decoration: line-through"' : '') + '" href="\\#" onclick="EditPahRef()">' + symbolEdit + ' Редактировать</a>'
            },
            {
                name: "del",
                text: "Удалить",
                template: '<a class="k-button"' + (!userCanChangeData ? ' style="text-decoration: line-through"' : '') + '" href="\\#" onclick="DelPahRef()">' + symbolDelete + ' Удалить</a>'
            }
        ],
        excelExport: excelexport,
        excel: {
            allPages: true,
            fileName: "IncomingInvoices.xlsx"
        },
        columns: [{
            field: "Prior0",
            title: "Базовый по сети БЕССРОЧНЫЙ", //
            width: "80px",
            headerAttributes: { style: "white-space: normal; vertical-align: top;" },
            template: function (dataItem) {
                return getRefCell(dataItem, 0);
            }
        }, {
                field: "Prior1",
                title: "Базовый по сети МЕСЯЦ", //
                width: "80px",
                headerAttributes: { style: "white-space: normal; vertical-align: top;" },
                template: function (dataItem) {
                    return getRefCell(dataItem, 1);
                }
            }, {
                field: "Prior2",
                title: "По локации БЕССРОЧНЫЙ", 
                width: "80px",
                headerAttributes: { style: "white-space: normal; vertical-align: top;" },
                template: function (dataItem) {
                    return getRefCell(dataItem, 2);
                }
            }, {
                field: "Prior3",
                title: "По локации МЕСЯЦ",
                width: "140px",
                headerAttributes: { style: "white-space: normal; vertical-align: top;" },
                template: function (dataItem) {
                    return getRefCell(dataItem, 3);
                }
            }, {
                field: "Prior4",
                title: "На ресторан БЕССРОЧНЫЙ",
                width: "140px",
                headerAttributes: { style: "white-space: normal; vertical-align: top;" },
                template: function (dataItem) {
                    return getRefCell(dataItem, 4);
                }
            }, {
                field: "Prior5",
                title: "На ресторан МЕСЯЦ",
                width: "180px",
                headerAttributes: { style: "white-space: normal; vertical-align: top;" },
                template: function (dataItem) {
                    return getRefCell(dataItem, 5);
                }
            },],
        selectable: "cell",
        height: 750,
        resizable: true,
        dataSource: data_source,
        dataBound: function () {
            if (selectedId == null)
                return;
            dataView = this.dataSource.view();
            for (var i = 0; i < dataView.length; i++) {
                var ind = null;
                var uid = null;
                for (var j = 0; j <= 5; j++) {
                    var item = dataView[i]["Prior" + String(j)];
                    if (item != null && item.Id == selectedId) {
                        ind = j;
                        uid = item.uid;
                    }
                }
                if (ind != null) {
                    //var ttt = $("#grid_writeoff_refers tbody").find("tr[data-uid=" + dataView[i].uid + "]");
                    //var tttt = $("#grid_writeoff_refers tbody").find("tr[data-uid=" + dataView[i].uid + "]").children();
                    //var ttttt = $("#grid_writeoff_refers tbody").find("tr[data-uid=" + dataView[i].uid + "]").children().eq(ind);
                    $("#grid_writeoff_refers tbody").find("tr[data-uid=" + dataView[i].uid + "]").children().eq(ind).addClass("k-state-selected");
                }
                //if (uid != null) {
                //    $("#grid_writeoff_refers tbody").find("td[data-uid=" + uid + "]").children().eq(i).addClass("k-state-selected");
                //}
            }
        },
    });

    $("#grid_writeoff_refers").data("kendoGrid").dataSource.read();
}
function getRefCell(dataItem, prior) {
    var colName = "Prior" + String(prior)
    if (dataItem[colName] != null) {
        var val = dataItem[colName];
        var eqType = EqTypes.filter(_eq => _eq.Id == val.EqualTypeId)[0].Note;

        var isOldStyle = "";
        var isOld = false;
        var monthStr = null;
        if (val.MonthDate != null) {
            var dt = kendo.parseDate(val.MonthDate, 'yyyy-MM-ddTHH:mm:ss');
            monthStr = kendo.toString(dt, 'yyyy')+" <b>"+Months[Number(kendo.toString(dt, 'MM')) - 1] + "</b>" 
            //monthStr = Months[Number(kendo.toString(dt, 'MM'))-1]+" " + kendo.toString(dt, 'yyyy')
            //monthStr = kendo.toString(dt, 'MM.yyyy')
            //monthStr = Months[dt.getMonth()] + " " + String(dt.getYear());

            var now = new Date();
            var diff = Math.round((now - dt) / 1000 / 60 / 60 / 24);
            var maxDiff = 75;
            if (diff > maxDiff) {
                isOld = true;
                isOldStyle = "style='color:lightgray'";
            }
        }

        var depStr = null;
        if (val.DepId != null) {
            var deps = DepartmentList.filter(_dep => _dep.DepId == val.DepId);
            if (deps.length > 0) {
                //depStr = String(deps[0].DepNum);
                depStr = deps[0].DepName + " (" + String(deps[0].DepNum)+")";
            }
            else
                depStr = "НЕ АКТИВНО";
        }
        var placeStr = val.Place != null ? (val.Place != "Город" ? "Аэро" : val.Place) : null;
        
        return ("<div class='pahRefID'>" + String(val.Id) + "</div>")
            + ("<div class='pahRefPrior'>" + String(prior) + "</div>")
            + ((monthStr != null || placeStr != null || depStr != null) ? "<div " + isOldStyle + ">" : "")
            + (placeStr != null ? ("<span>" + String(placeStr) + "</span>") : "")
            + (depStr != null ? ("<span>" + String(depStr) + "</span>") : "")
            + (monthStr != null ? ("<span" + ((placeStr != null || depStr != null) ? " style='float:right'" : "") + ">" + String(monthStr) + "</span> ") : "")
            //+ (monthStr != null ? ("<b>" + String(monthStr) + "</b> ") : "")
            //    + (placeStr != null ? ("<span" + ((monthStr != null)? " style='float:right'" : "")+">"+String(placeStr)+"</span>") : "")
            //    + (depStr != null ? ("<span" + ((monthStr != null) ? " style='float:right'" : "")+">"+String(depStr)+"</span>") : "")
            + ((monthStr != null || placeStr != null || depStr != null) ? "</div>" : "")
            + ("<div " + isOldStyle + ">"
                + (val.Value != null
                ?
                (
                    ("<i>"+String(eqType)+"</i>")
                    + " "
                    + ("<b " + (isOld ? isOldStyle : "style='color:darkblue'") + ">"
                    + (kendo.toString(repNow.isPercent ? (val.Value * 100) : val.Value, (repNow.isPercent ? "#.## \\%" : "#.####")))                    
                    //+ (String(val) + (repNow.isPercent ? " %" : ""))
                    //+ (kendo.toString(repNow.isPercent ? (val.Value * 100) : val.Value, ((Math.floor((val.Value % 1) * Math.pow(10, 4)) == 0) ? "0" : (repNow.isPercent ? "0.0000" : "0.00"))) + (repNow.isPercent ? " %" : ""))
                    + "</b>")
                )
                : "<i>НЕ ОПРЕД.</i>"
            )+"</div>");
    }
    else
        return "<div class='pahRefPrior'>" + String(prior) + "</div><div>&nbsp;</div><div>&nbsp;</div>";
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




function DeleteDishKoef(barcod) {
    if (!userCanChangeData)
        return;
    if (!confirm("Удалить блюдо?"))
        return;

    var send_data = new Object();

    send_data.Barcode = barcod;
    send_data.Value = 0;

    $.ajax({
        url: "https://" + host + complaints + "/api/Info/DeleteDishCoefficient",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(send_data),
        success: function (dataResp) {
            var newDataSrc = [];
            var data = $("#grid_dish_koefs").data("kendoGrid").dataSource;
            data.data().forEach(function (item) { if (item.Barcode !== dataResp.Barcode) newDataSrc.push({ Barcode: item.Barcode, Name: item.Name, Value: item.Value }) });
            $("#grid_dish_koefs").data("kendoGrid").setDataSource(newDataSrc);

        },
        error: function () {
            alert("Ошибка удаления!");
        }
    });
}

function EditDishKoef() {
    if (!userCanChangeData)
        return;

    var barcode = null;
    var value = null;
    var grid = $("#grid_dish_koefs").data("kendoGrid");
    grid.select().each(function () {
        var item = grid.dataItem(this);
        if (!isNaN(item.Barcode)) {
            barcode = item.Barcode
            value = item.Value
        }
    });
    if (barcode === null) {
        alert("Выберите позицию");
        return;
    }

    $("#dish_koeff_barcod").prop("disabled", true);
    $("#dish_koeff_barcod").val(barcode);
    $("#dish_koeff_value").val(value);

    $("#window_dish_koeff_edit").data("kendoWindow").title("Редактировать");
    $("#window_dish_koeff_edit").data("kendoWindow").center().open();


   // //setTimeout(function () { $("#dish_koeff_value").select(); }, 15);
   // setTimeout(function () {
        
   // }, 150);
   //// $("#dish_koeff_value").focus();
    
}


function AddDishKoef() {
    if (!userCanChangeData)
        return;

    $("#dish_koeff_barcod").prop("disabled", false);
    $("#dish_koeff_barcod").val("");
    $("#dish_koeff_value").val("");

    $("#window_dish_koeff_edit").data("kendoWindow").title("Создать");
    $("#window_dish_koeff_edit").data("kendoWindow").center().open();
}


function onDKSave() {
    var barcod = $("#dish_koeff_barcod").val();
    if (isNaN(barcod) || barcod <= 0 || barcod > 9999999) {
        alert("Введите корректный баркод");
        return;
    }
    var value = $("#dish_koeff_value").val().replace(" ","");
    if (isNaN(value))
        value = value.replace(",", ".");
    if (isNaN(value))
        value = value.replace(".", ",");
    if (isNaN(value) || value < 0 || value > 100) {
        alert("Введите корректное значение");
        return;
    }

    if (value === "")
        value = null;

    var isAdd = !$("#dish_koeff_barcod").prop("disabled");

    var data = $("#grid_dish_koefs").data("kendoGrid").dataSource;
    if (isAdd) {
        var exists = false;
        data.data().forEach(function (item) { if (item.Barcode == barcod) exists = true; });
        if (exists) {
            alert("Такой баркод уже существует");
            return;
        }
    }

    var send_data = new Object();

    send_data.Barcode = barcod;
    send_data.Value = value;

    $.ajax({
        url: "https://" + host + complaints + "/api/Info/" + (isAdd ? "AddDishCoefficient" :"EditDishCoefficient"),
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(send_data),
        success: function (dataResp) {
            if (isAdd) {
                var newDataSrc = [];
                data.data().forEach(function (item) { newDataSrc.push({ Barcode: item.Barcode, Name: item.Name, Value: item.Value }) });
                newDataSrc.push({ Barcode: dataResp.Barcode, Name: dataResp.Name, Value: dataResp.Value });
                $("#grid_dish_koefs").data("kendoGrid").setDataSource(newDataSrc);
            }
            else {
                data.data().forEach(function (item) { if (item.Barcode == dataResp.Barcode) item.Value = dataResp.Value; });
                $("#grid_dish_koefs").data("kendoGrid").setDataSource(data);
            }
            $("#window_dish_koeff_edit").data("kendoWindow").center().close();
        },
        error: function () {
            alert("Ошибка записи!");
        }
    });
}

function UpdateDishBottles() {
    if (!confirm("Новые бутылки будут добавлены из конфиг. центра Авроры. Продолжить?"))
        return;

    var grid = $("#grid_dish_koefs").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_dish_koefs").remove();

    WaitShow("dish_koefs");

    $.ajax({
        url: "https://" + host + "/complaints/api/info/UpdateDishBottles",
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("dish_koefs", null);
            if (typeof (data) == "object") {
                PrepareData(data)
            };
        },
        error: function () {
            WaitHide("dish_koefs", "Произошла ошибка при загрузке списка коэффициентов блюд");
        }
    })
}

function EditPahRef() {
    if (!userCanChangeData || repNow == null)
        return;

    var grid = $("#grid_writeoff_refers").data("kendoGrid");

    var rows = grid.select();
    var id = null;
    var prior = null;

    $(rows).each(function () {
        $(this.innerHTML).each(function () { if ($(this).hasClass("pahRefID")) id = $(this).html(); });
        $(this.innerHTML).each(function () { if ($(this).hasClass("pahRefPrior")) prior = $(this).html(); });
    });
    if (id == null) {
        alert("Выберите ячейку для редактирования")
        return;
    }

    var itm = null;
    var data = $("#grid_writeoff_refers").data("kendoGrid").dataSource;
    data.data().forEach(function (item)
    {
        if (item["Prior" + String(prior)] != null && item["Prior" + String(prior)].Id == id)
            itm = item["Prior" + String(prior)];
    });

    if (itm == null)
        return;



    $("#pah_ref_id").val(id);
    $("#pah_ref_prior").val(prior);
    $("#pah_ref_percent_label").html(repNow.isPercent ? "%" : "&nbsp;");

    $("#pah_ref_value").val(itm.Value != null ? (kendo.toString(repNow.isPercent ? (itm.Value * 100) : itm.Value, (repNow.isPercent ? "#.##" : "#.####"))) : "");
    if (itm.DepId != null)
        $("#pah_ref_dep").data("kendoComboBox").value(itm.DepId);
    if (itm.Place != null)
        $("#pah_ref_place").data("kendoComboBox").value(itm.Place);
    if (itm.MonthDate != null)
        $("#pah_ref_month").data("kendoComboBox").text(
            kendo.toString(kendo.parseDate(itm.MonthDate, 'yyyy-MM-ddTHH:mm:ss'), 'MM.yyyy')
            //Months[Number(kendo.toString(itm.MonthDate, 'MM')) - 1] + " " + kendo.toString(itm.MonthDate, 'yyyy')
        );

    setInputsByPrior(prior, false)

    $("#window_pah_ref_edit").data("kendoWindow").title("Редактировать");
    $("#window_pah_ref_edit").data("kendoWindow").center().open();
}

function AddPahRef() {
    if (!userCanChangeData || repNow == null)
        return;

    var grid = $("#grid_writeoff_refers").data("kendoGrid");

    var rows = grid.select();
    var prior = null;

    $(rows).each(function () {
        $(this.innerHTML).each(function () { if ($(this).hasClass("pahRefPrior")) prior = $(this).html(); });
    });

    if (prior === null) {
        alert("Выберите столбец для добавления")
        return
    }

    $("#pah_ref_id").val("");
    $("#pah_ref_prior").val(prior);
    $("#pah_ref_percent_label").html(repNow.isPercent ? "%" : "&nbsp;");

    $("#pah_ref_value").val("");
    $("#pah_ref_dep").data("kendoComboBox").value("");
    $("#pah_ref_place").data("kendoComboBox").value("");
    $("#pah_ref_month").data("kendoComboBox").value("");

    setInputsByPrior(prior, true)

    $("#window_pah_ref_edit").data("kendoWindow").title("Создать");
    $("#window_pah_ref_edit").data("kendoWindow").center().open();
}

function DelPahRef() {
    if (!userCanChangeData || repNow == null)
        return;

    var grid = $("#grid_writeoff_refers").data("kendoGrid");

    var rows = grid.select();
    var id = null;

    $(rows).each(function () {
        $(this.innerHTML).each(function () { if ($(this).hasClass("pahRefID")) id = $(this).html(); });
    });
    if (id == null) {
        alert("Выберите ячейку для удаления")
        return;
    }

    if (!confirm("Подтвердите удаление выбранной учейки"))
        return;


    var send_data = Number(id);

    $.ajax({
        url: "https://" + host + "/complaints/api/info/DeleteReferenceValue",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(send_data),
        success: function (data) {
            if (typeof (data) == "object") {
                PrepareDataRefers(data.UpdatedTable, repNow.type, repNow.id, data.SelectedId)
            };
        },
        error: function () {
            alert("Произошла ошибка при работе с базой данных");
        }
    })
}

function setInputsByPrior(prior, addNew) {
    var height = 264
    var pah_ref_dep = true
    var pah_ref_place = true
    var pah_ref_month = true
    switch (Number(prior)) {
        case 0:
            height = 114;
            pah_ref_dep = false
            pah_ref_place = false
            pah_ref_month = false
            break;
        case 1:
            height = 164;
            pah_ref_dep = false
            pah_ref_place = false
            pah_ref_month = true
            break;
        case 2:
            height = 164;
            pah_ref_dep = false
            pah_ref_place = true
            pah_ref_month = false
            break;
        case 3:
            height = 214;
            pah_ref_dep = false
            pah_ref_place = true
            pah_ref_month = true
            break;
        case 4:
            height = 164;
            pah_ref_dep = true
            pah_ref_place = false
            pah_ref_month = false
            break;
        case 5:
            height = 214;
            pah_ref_dep = true
            pah_ref_place = false
            pah_ref_month = true
            break;
    }

    $("#pah_ref_dep_div").css("display", pah_ref_dep ? "block" : "none");
    $("#pah_ref_place_div").css("display", pah_ref_place ? "block" : "none");
    $("#pah_ref_month_div").css("display", pah_ref_month ? "block" : "none");
    $("#window_pah_ref_edit").data("kendoWindow").setOptions({ height: String(height) + "px" })

    var eqType = null;
    $("#grid_writeoff_refers").data("kendoGrid").dataSource.data().forEach(function (item) {
        for (var i = 0; i <= 5;i++)
            if (item["Prior" + String(i)] != null)
                eqType = item["Prior" + String(i)].EqualTypeId;
    });

    $("#pah_ref_eq_type").data("kendoComboBox").value(eqType != null ? eqType : "");

    $("#pah_ref_value").css("background-color", addNew ? "white" : "#FFFFEE");

    $("#pah_ref_dep").data("kendoComboBox").readonly(!addNew);
    $("#pah_ref_place").data("kendoComboBox").readonly(!addNew);
    $("#pah_ref_month").data("kendoComboBox").readonly(!addNew);
    $("#pah_ref_eq_type").data("kendoComboBox").readonly(eqType != null ); 


    //if (prior == 0)
    //    $("#window_pah_ref_edit").data("kendoWindow").height("114px");
    //if (prior == 1 || prior == 2 || prior == 4)
    //    $("#window_pah_ref_edit").data("kendoWindow").height("164px");
    //if (prior == 3 || prior == 5)
    //    $("#window_pah_ref_edit").data("kendoWindow").height("214px");
}


function onPahRefSave() {
    var id = $("#pah_ref_id").val();
    var value = $("#pah_ref_value").val();

    if (value !== "") {
        if (isNaN(value))
            value = value.replace(",", ".");
        if (isNaN(value))
            value = value.replace(".", ",");
        if (isNaN(value) || value < 0) {
            alert("Введите корректное значение");
            return;
        }
    }

    if ($("#pah_ref_dep_div").css("display") != "none" && $("#pah_ref_dep").data("kendoComboBox").value() == "") {
        alert("Выберите подразделение");
        return;
    }
    if ($("#pah_ref_place_div").css("display") != "none" && $("#pah_ref_place").data("kendoComboBox").value() == "") {
        alert("Выберите локацию (город/аэропорт)");
        return;
    }
    if ($("#pah_ref_month_div").css("display") != "none" && $("#pah_ref_month").data("kendoComboBox").value() == "") {
        alert("Выберите месяц");
        return;
    }
    if ($("#pah_ref_eq_type").data("kendoComboBox").value() == "") {
        alert("Тип сравнения (больше, меньше и т.д.)");
        return;
    }

    var send_data = new Object();
    if (id == "") {
        send_data.Id = -1;

        send_data.DepId = ($("#pah_ref_dep_div").css("display") != "none") ? Number($("#pah_ref_dep").data("kendoComboBox").value()) : (null);
        send_data.MonthDate = ($("#pah_ref_month_div").css("display") != "none") ? ($("#pah_ref_month").data("kendoComboBox").value()) : (null);
        send_data.Place = ($("#pah_ref_place_div").css("display") != "none") ? ($("#pah_ref_place").data("kendoComboBox").value()) : (null);

        send_data.TestWebAPIReportName = (repNow.type == "S" ? repNow.id : null)
        send_data.CheckListReportId = (repNow.type == "C" ? Number(repNow.id) : null)
        send_data.ReportTypeID = (repNow.type == "R" ? Number(repNow.id) : null)

        send_data.Prior = Number($("#pah_ref_prior").val())
        send_data.EqualTypeId = Number($("#pah_ref_eq_type").val())
        send_data.Value = (value !== "") ? (repNow.isPercent ? (Number(value) / 100) : Number(value)) : null;
    }
    else {
        send_data.Id = id;
        send_data.Prior = Number($("#pah_ref_prior").val())
        send_data.EqualTypeId = Number($("#pah_ref_eq_type").val())
        send_data.Value = (value !== "") ? (repNow.isPercent ? (Number(value) / 100) : Number(value)) : null;
    }

    $.ajax({
        url: "https://" + host + "/complaints/api/info/PostReferenceValue",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(send_data),
        success: function (data) {
            if (typeof (data) == "object") {
                PrepareDataRefers(data.UpdatedTable, repNow.type, repNow.id, data.SelectedId)
                $("#window_pah_ref_edit").data("kendoWindow").center().close();
            };
        },
        error: function () {
            alert("Произошла ошибка при работе с базой данных");
        }
    })
}







function RefreshOuterRefers() {

    var grid = $("#grid_outer_refers").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_outer_refers").remove();

    repManNow = null;

    var rep = $("#outer_refers_rep_types").data("kendoComboBox").value();
    var month = $("#outer_refers_month").data("kendoComboBox").value();

    if (rep == "" || rep == null || month == "" || month == null) 
        return;

    var DT = month.split('/');
    var FDate = DT[2] + DT[1] + DT[0];

    WaitShow("outer_refers");

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetOuterReferences?FDate=" + FDate + "&ReportId=" + String(rep),
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("outer_refers", null);
            if (typeof (data) == "object") {
                PrepareDataOuterRefers(data, rep)
            };
        },
        error: function () {
            WaitHide("outer_refers", "Произошла ошибка при загрузке референсных значений");
        }
    })
}

function RefreshRestWorkTime() {

    var grid = $("#grid_rest_work_time").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_rest_work_time").remove();

    WaitShow("rest_work_time");

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetRestWorkingTimes",
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("rest_work_time", null);
            if (typeof (data) == "object") {
                PrepareDataWorkTime(data)
            };
        },
        error: function () {
            WaitHide("rest_work_time", "Произошла ошибка при загрузке графика работы рестранов");
        }
    })
}






function PrepareDataOuterRefers(data_source, repTypeVal) {

    var isPercent = false;
    var rep = Reports.filter(_rep => _rep.Id == repTypeVal);
    if (rep.length > 0)
        isPercent = (rep[0].Format.indexOf("%") != -1);
    var eqType = null;

    repManNow = new ReportNow("R", repTypeVal, isPercent, eqType);



    if (repManNow.isPercent)
        for (var i = 0; i < data_source.length; i++)
            if (data_source[i].Value != null)
                data_source[i].Value *= 100;



    $("#box_outer_refers").append("<div id='grid_outer_refers'></div>");
    $("#grid_outer_refers").kendoGrid({
        toolbar: ["excel"],
        excel: {
            allPages: true,
            fileName: "OuterRefers.xlsx"
        },
        columns: [{
            field: "DepName",
            title: "Ресторан",
            width: "310px",
            editable: function () { return false; }
        }, {
            field: "Value",
                title: "Показатель" + (repManNow.isPercent ? ", %" : ""),
                editable: function () { return userCanChangeData;/*user_id == 2107;*//*userCanChangeData;*/ },
                template: function (dataItem) {
                    return ((repManNow.id == 29 && dataItem.Value == null)
                        ? "0"
                        : (dataItem.Value != null ?(kendo.toString(dataItem.Value, (repManNow.isPercent ? "#.##" : "#.####"))):"")    );
                }
        }],
        sortable: true,
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source,
        editable: true,
        cellClose: function (e) {
            if (e.model.Value != grid_prev_val) {
                var promptVal = e.model.Value;
                var cancel = false;

                while (!cancel && promptVal != null && isNaN(promptVal)) {
                    var res = prompt("Введите числовое или пустое значение", promptVal);
                    if (res === null)
                        cancel = true;
                    else {
                        promptVal = res;
                        if (promptVal != null && isNaN(promptVal)) promptVal = res.replace(",", ".");
                        if (promptVal != null && isNaN(promptVal)) promptVal = res.replace(".", ",");
                    }
                }
                if (cancel) {
                    e.model.Value = grid_prev_val;
                    $('#grid_outer_refers').data('kendoGrid').refresh();
                    $(window).off('beforeunload');
                }
                else {
                    var rep = Number($("#outer_refers_rep_types").data("kendoComboBox").value());
                    var month = $("#outer_refers_month").data("kendoComboBox").value();

                    if (rep == "" || rep == null || month == "" || month == null || repManNow == null || repManNow.id == null) {
                        e.model.Value = grid_prev_val;
                        $('#grid_outer_refers').data('kendoGrid').refresh();
                        alert("Выберите показатель и месяц");
                        return;
                    }

                    var val = (promptVal != null && promptVal != "") ? parseFloat(promptVal) : null;

                    if (val != null) {
                        if (repManNow.isPercent)
                            val = val / 100;
                        if (rep == 29 && val !== 0 && val !== 1) {
                            e.model.Value = grid_prev_val;
                            $('#grid_outer_refers').data('kendoGrid').refresh();
                            alert("Введите единицу или ноль");
                            return;
                        }
                    }

                    var send_data = { DepNum: e.model.DepNum, Month: month, ReportId: rep, Value: val };
                    $.ajax({
                        url: "https://" + host + "/complaints/api/info/PostOuterReference",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(send_data),
                        success: function (data) {
                            e.model.Value = (repManNow.isPercent && data.Value != null) ? (data.Value * 100) : data.Value;

                            var lastRowUid = e.model.uid;
                            var row = $("#grid_outer_refers").data("kendoGrid").table.find("[data-uid=" + lastRowUid + "]");
                            $(row).children().eq(1).html(((repManNow.id == 29 && data.Value == null)
                                ? "0"
                                : (data.Value != null
                                    ? (kendo.toString((repManNow.isPercent && data.Value != null) ? (data.Value * 100) : data.Value, (repManNow.isPercent ? "#.##" : "#.####")))
                                    : "")))
                            //$('#grid_outer_refers').data('kendoGrid').refresh();
                        },
                        error: function () {
                            e.model.Value = grid_prev_val;
                            $('#grid_outer_refers').data('kendoGrid').refresh();
                            alert("Произошла ошибка при записи значения");
                        }
                    })

                    //Send
                    // of error? return prev_val
                    $(window).off('beforeunload');
                }
            }
            else
                $(window).off('beforeunload');
        },
        beforeEdit: function (e) {
            grid_prev_val = e.model.Value;
            $(window).on('beforeunload', function () {
                return "В случае подтверждения закрытия окна браузера, все несохраненные данные будут утеряны.";
            });
        }
    });

    $("#grid_outer_refers").data("kendoGrid").dataSource.read();
}


function PrepareDataWorkTime(data_source) {
    for (var i = 0; i < data_source.length; i++)
        data_source[i].OpeningTime = TimeTemplate(data_source[i].OpeningTime)
    $("#box_rest_work_time").append("<div id='grid_rest_work_time'></div>");    
    $("#grid_rest_work_time").kendoGrid({
        toolbar: ["excel"],
        excel: {
            allPages: true,
            fileName: "WorkingTimes.xlsx"
        },
        columns: [{
            field: "DepName",
            title: "Ресторан",
            width: "310px",
            editable : function () { return false; }
        }, {
                field: "WorkingTime",
                title: "Среднее время работы в сутки, часов",
                headerAttributes: { style: "white-space: normal; vertical-align: top;" },
                editable: function () { return userCanChangeData; }
            }, {
                field: "OpeningTime",
                title: "Начало работы ресторана",
                headerAttributes: { style: "white-space: normal; vertical-align: top;" },
                //template: function (dataItem) { return TimeTemplate(dataItem.OpeningTime); },
                editable: function () { return userCanChangeData; }
            }],
        sortable: true,
        selectable: "cell",
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source,
        editable: true,
        cellClose: function (e) {
            var grid = e.sender;
            var cellIndex = grid.select().index();
            var col = grid.columns[cellIndex].field;
            var posId = Number(col.replace("Count", ""))
            var dep = e.model["DepNum"];
            //var columnTitle = grid.thead.find('th')[cellIndex].getAttribute("data-title");



            if (e.model[col] != grid_prev_val) {
                var promptVal = e.model[col];

                var cancel = false;

                if (col == "WorkingTime") {
                    var badNum = false;
                    if (!isNaN(promptVal) && promptVal != "" && promptVal != null) {
                        var asNum = Number(promptVal)
                        if (asNum <= 0 || asNum > 24)
                            badNum = true;
                    }
                    while ((!cancel && promptVal != null && isNaN(promptVal)) || badNum) {
                        badNum = false;
                        var res = prompt("Введите числовое (от 1 до 24) или пустое значение", promptVal);
                        if (res === null)
                            cancel = true;
                        else {
                            promptVal = res;
                            if (promptVal != null && isNaN(promptVal)) promptVal = res.replace(",", ".");
                            if (promptVal != null && isNaN(promptVal)) promptVal = res.replace(".", ",");
                            if (!isNaN(promptVal) && promptVal != "" && promptVal != null) {
                                var asNum = Number(promptVal)
                                if (asNum <= 0 || asNum > 24)
                                    badNum = true;
                            }
                        }
                    }
                }
                else {
                    //col == "OpeningTime"
                    var badNum = false;
                    var time = ParseTime(promptVal)
                    if (time.Hours === null && time.Minutes === null) 
                        badNum = true;
                    while ((!cancel && (promptVal !== null && promptVal !== "")) && badNum) {
                        badNum = false;
                        var res = prompt("Введите время в формате 00:00", promptVal);
                        if (res === null)
                            cancel = true;
                        else {
                            promptVal = res;
                            time = ParseTime(promptVal)
                            if (time.Hours === null && time.Minutes === null)
                                badNum = true;
                        }
                    }
                    if (!cancel && (promptVal !== null && promptVal !== "")) {
                        var baseMin = 60 * 1000 * 10 * 1000;
                        promptVal = String((time.Minutes * baseMin) + (time.Hours * baseMin * 60))
                    }
                }


                if (cancel) {
                    e.model[col] = grid_prev_val;
                    $('#grid_rest_work_time').data('kendoGrid').refresh();
                    $(window).off('beforeunload');
                }
                else {
                    var send_data = { DepNum: e.model.DepNum, Value: (promptVal != null && promptVal != "") ? parseFloat(promptVal): null };
                    $.ajax({
                        url: "https://" + host + "/complaints/api/info/PostRestWorkingTimeParam?Param=" + col,
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(send_data),
                        success: function (data) {
                            e.model[col] = data.Value;
                            var lastRowUid = e.model.uid;
                            var row = $("#grid_rest_work_time").data("kendoGrid").table.find("[data-uid=" + lastRowUid + "]");
                            if (col == "WorkingTime")
                                $(row).children().eq(1).html(kendo.toString(data.Value, "#.##"));
                            else
                                $(row).children().eq(2).html(TimeTemplate(data.Value));
                            //$('#grid_rest_work_time').data('kendoGrid').refresh();
                        },
                        error: function () {
                            e.model[col] = grid_prev_val;
                            $('#grid_rest_work_time').data('kendoGrid').refresh();
                            alert("Произошла ошибка при записи значения");
                        }
                    })

                    

                    //Send
                    // of error? return prev_val
                    $(window).off('beforeunload');
                }
            }
            else
            $(window).off('beforeunload');
        },
        beforeEdit: function (e) {
            //grid_prev_val = e.model.Value;
            var grid = e.sender;
            var cellIndex = grid.select().index();
            var col = grid.columns[cellIndex].field;

            grid_prev_val = e.model[col];
            $(window).on('beforeunload', function () {
                return "В случае подтверждения закрытия окна браузера, все несохраненные данные будут утеряны.";
            });
        }
    });

    $("#grid_rest_work_time").data("kendoGrid").dataSource.read();
}

function TimeTemplate(num) {
    if (num === null)
        return "";
    mins = num / (60 * 1000 * 10 * 1000);
    return (kendo.toString(Math.trunc(mins / 60), "00.##") + ":" + kendo.toString(mins % 60, "00.##"))
}

function ParseTime(str) {
    var res = { Hours: null, Minutes: null }
    if (str != null && (typeof (str) == "string") && str.length == 5 && str[2] == ":") {
        var parsed = [parseInt(str[0]), parseInt(str[1]), parseInt(str[3]), parseInt(str[4])];
        var numOk = true;
        for (var i = 0; i < parsed.length; i++) if (isNaN(parsed[i])) numok = false;
        if (numOk) {
            var hours = Number(String(parsed[0]) + String(parsed[1]))
            var mins = Number(String(parsed[2]) + String(parsed[3]))
            if (hours >= 0 && hours < 24 && mins >= 0 && mins < 60) {
                res.Minutes = mins;
                res.Hours = hours; 
            }
        }
    }
    return res;
}

function RefreshStaffing() {
    var grid = $("#grid_staffing").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_staffing").remove();

    WaitShow("staffing");

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetStaffingTable",
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("staffing", null);
            if (typeof (data) == "object") {
                //console.log(data);
                if (data.Positions){
                    PositionList = data.Positions;
                }
                PrepareStaffingData(data)
            };
        },
        error: function () {
            WaitHide("staffing", "Произошла ошибка при загрузке штатных расписаний");
        }
    })
}

function PrepareStaffingData(data) {
    var data_source = [];
    var columns = [{
        field: "DepName",
        title: "Ресторан",
        width: "200px",
        headerAttributes: { style: "white-space: normal; vertical-align: top;" },
        editable: function () { return false; }
    }, {
        field: "CountAll",
            title: "Всего",
            width: "80px",
            headerAttributes: { style: "white-space: normal; vertical-align: top;" },
            editable: function () { return false; },
            template: function (dataItem) {
                var summ = 0;
                Object.keys(dataItem).forEach(key => { if (key.indexOf("CountAll") == -1 && key.indexOf("Count") != -1 && dataItem[key] != null) summ += Number(dataItem[key]); });
                return "<b>" + String(summ) + "</b>";
            }
    }];

    data.Positions.forEach(function (pos) {
        columns.push({
            field: "Count" + String(pos.Id),
            title: pos.Name,
            width: "100px",
            headerAttributes: { style: "white-space: normal; vertical-align: top;" },
            editable: function () { return userCanChangeOnlyStaffTableData; }
        });
    });

    data.Deps.forEach(function (dep) {
        var obj = new Object()
        obj["DepNum"] = dep.Id
        obj["DepName"] = dep.Name
        obj["DepName2"] = dep.Name

        var records = data.Records.filter(_rec => _rec.DepNum == dep.Id);
        records.forEach(function (item) {
            if (item.PosId != null)
                obj["Count" + String(item.PosId)] = item.Value;
            //else {
            //    obj["CountAll"] = item.Value;
            //    obj["CountAll2"] = item.Value;
            //}
        })

        //data.Positions.forEach(function (pos) {
        //    var value = null;
        //    var records = data.Records.filter(_rec => _rec.DepNum = dep.Id && _rec.PosId == pos.Id);
        //    if (records.length > 0)
        //        value = records[0].Value;
        //    obj["Count" + String(pos.Id)] = { Value: value, PosId: pos.Id, DepNum: dep.Id };
        //});

        data_source.push(obj);
    });

    columns.push({
        field: "CountAll2",
        title: "Всего",
        width: "80px",
        headerAttributes: { style: "white-space: normal; vertical-align: top;" },
        editable: function () { return false; },
        template: function (dataItem) {
            var summ = 0;
            Object.keys(dataItem).forEach(key => { if (key.indexOf("CountAll") == -1 && key.indexOf("Count") != -1 && dataItem[key] != null) summ += Number(dataItem[key]); });
            return "<b>" + String(summ) + "</b>";
        }
    });
    columns.push({
        field: "DepName2",
        title: "Ресторан",
        width: "200px",
        headerAttributes: { style: "white-space: normal; vertical-align: top;" },
        editable: function () { return false; }
    });

    $("#box_staffing").append("<div id='grid_staffing'></div>");
    $("#grid_staffing").kendoGrid({
        toolbar: [
            "excel",            
        ],
        excel: {
            allPages: true,
            fileName: "Staffing.xlsx"
        },
        columns: columns,
        sortable: true,
        selectable: "cell",//"row",
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source,
        dataBound: function () {
            //$('#grid_staffing .k-grid-content').height("750px");
            $('#grid_staffing .k-grid-content').height("90%");
        },
        editable: true,
        cellClose: function (e) {

            var grid = e.sender;
            var cellIndex = grid.select().index();
            var col = grid.columns[cellIndex].field;
            var posId = Number(col.replace("Count",""))
            var dep = e.model["DepNum"];
            //var columnTitle = grid.thead.find('th')[cellIndex].getAttribute("data-title");



            if (e.model[col] != grid_prev_val) {
                var promptVal = e.model[col];
                var cancel = false;

                var badNum = false;
                if (!isNaN(promptVal) && promptVal != "" && promptVal != null) {
                    var asNum = Number(promptVal)
                    if (asNum < 0)
                        badNum = true;
                }
                while ((!cancel && promptVal != null && isNaN(promptVal)) || badNum || String(promptVal).indexOf('.') != -1 || String(promptVal).indexOf(',') != -1) {
                    badNum = false;
                    var res = prompt("Введите целое число или пустое значение", promptVal);
                    if (res === null)
                        cancel = true;
                    else {
                        promptVal = res;
                    }
                }
                if (cancel) {
                    e.model[col] = grid_prev_val;
                    $('#grid_staffing').data('kendoGrid').refresh();
                    $(window).off('beforeunload');
                }
                else {


                    var send_data = { DepNum: dep, Value: (promptVal != null && promptVal != "") ? parseFloat(promptVal) : null, PosId: posId };
                    $.ajax({
                        url: "https://" + host + "/complaints/api/info/PostStaffingTableValue",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(send_data),
                        success: function (data) {
                            e.model["Count" + String(data.PosId)] = data.Value;
                            var lastRowUid = e.model.uid;
                            var row = $("#grid_staffing").data("kendoGrid").table.find("[data-uid=" + lastRowUid + "]");
                            $(row).children().eq(cellIndex).html(kendo.toString(data.Value, "#.##"));


                            var summ = 0;
                            Object.keys(e.model).forEach(key => { if (key.indexOf("CountAll") == -1 && key.indexOf("Count") != -1 && e.model[key] != null) summ += Number(e.model[key]); });
                            var allHtml =  "<b>" + String(summ) + "</b>";
                            $(row).children().eq(1).html(allHtml);
                            $(row).children().eq($(row).children().length - 2).html(allHtml);

                            //$('#grid_rest_work_time').data('kendoGrid').refresh();
                        },
                        error: function () {
                            e.model.Value = grid_prev_val;
                            $('#grid_staffing').data('kendoGrid').refresh();
                            alert("Произошла ошибка при записи значения");
                        }
                    })



                    //Send
                    // of error? return prev_val
                    $(window).off('beforeunload');
                }
            }
            else
                $(window).off('beforeunload');
        },
        beforeEdit: function (e) {
            var grid = e.sender;
            var cellIndex = grid.select().index();
            var col = grid.columns[cellIndex].field;

            grid_prev_val = e.model[col];
            $(window).on('beforeunload', function () {
                return "В случае подтверждения закрытия окна браузера, все несохраненные данные будут утеряны.";
            });
        }
    });

    $("#grid_staffing").data("kendoGrid").dataSource.read();
}


function RefreshStaffTurnover() {

    var grid = $("#grid_staff_turnover_report").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_staff_turnover_report").remove();
    grid = $("#grid_staff_turnover_employyes").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_staff_turnover_employyes").remove();

    //var month = $("#staff_turnover_month").data("kendoComboBox").value();

    //if (month == "" || month == null) {
    //    alert("Выберите месяц")
    //    return;
    //}
    //var DT = month.split('/');
    //var FDate = DT[2] + DT[1] + DT[0];
    //var filtersGet = "MonthDate=" + FDate;

    var DT = $("#datepickerstart_staff_turnover").val().split('/');
    var FDate = DT[2] + DT[1] + DT[0];
    DT = $("#datepickerend_staff_turnover").val().split('/');
    var EDate = DT[2] + DT[1] + DT[0];
    var filtersGet = "FDate=" + FDate + "&EDate=" + EDate;


    var depId = $("#staff_turnover_deps").val();;
    if (depId != "" && depId != "ALL" && depId.toLowerCase() != "все") 
        filtersGet += "&CodShop=" + depId;

    //var depId = $("#staff_turnover_deps").data("kendoComboBox").value();
    //if (depId != "" && depId != "ALL")
    //    filtersGet += "&CodShop=" + depId;

    WaitShow("staff_turnover_report");
    WaitShow("staff_turnover_employyes"); 

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetStaffTurnover?" + filtersGet,
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("staff_turnover_report", null)
            WaitHide("staff_turnover_employyes", null);

            if (typeof (data) == "object") {
                //console.log(data);
                PrepareDataStaffTurnOverEmployees(data)
                StaffTurnoverModeChange(0)
            };
        },
        error: function () {
            WaitHide("staff_turnover_report", null)
            WaitHide("staff_turnover_employyes", "Произошла ошибка при построении отчета");
        }
    })
}


function PrepareDataStaffTurnOverEmployees(data) {

    var data_source = []

    data.forEach(function (item) {
        item.Employyes.forEach(function (empl) {
            var newObj = {
                DepNum: item.DepNum,
                DepName: item.DepName,
                EmployeeId: empl.Id,
                EmployeeFIO: empl.FIO,
                PositionId: empl.PosId,
                PositionName: empl.PosName,
                EntryDate: empl.EntryDate,
                DismDate: empl.DismDate,
                Experience: empl.Experience,
                Dates: empl.HasInRefPoint
                //Date1: empl.HasInRefPoint[0],
                //Date2: empl.HasInRefPoint[1],
                //Date3: empl.HasInRefPoint[2]
            }
            for (var j = 0; j < empl.HasInRefPoint.length; j++)
            {
                newObj["Date" + String(j + 1)] = empl.HasInRefPoint[j]// ? "<span style='color:green'>ЕСТЬ</span>" : "<span style='color:red'>НЕТ</span>"
            }
            data_source.push(newObj)
        })
    })

    // $("#forecast_dim_mode_manual").is(":checked")

    //var month = $("#staff_turnover_month").data("kendoComboBox").value();
    //if (month == "" || month == null) {
    //    alert("Выберите месяц")
    //    return;
    //}
    //month = kendo.parseDate(month);
    //var date1 = new Date(month.getFullYear(), month.getMonth(), 1, 0, 0, 0, 0)
    //var date2 = new Date(month.getFullYear(), month.getMonth(), 15, 0, 0, 0, 0)
    //var date3 = new Date(date1)
    //date3.setMonth(date3.getMonth() + 1)
    //date3.setDate(date3.getDate() - 1)

    //date1 = kendo.toString(date1, 'dd.MM.yyyy');
    //date2 = kendo.toString(date2, 'dd.MM.yyyy');
    //date3 = kendo.toString(date3, 'dd.MM.yyyy');

    var columns = [{
        field: "DepNum",
        title: "№ рест.",
        width: "80px"
    }, {
        field: "DepName",
        title: "Ресторан",
        width: "240px"
    },
    {
        field: "EmployeeId",
        title: "Staff №",
        width: "90px"
    },
    {
        field: "EmployeeFIO",
        title: "Работник, ФИО",
        width: "240px",
        minwidth: "140px"
    },
    {
        field: "PositionId",
        title: "PositionId",
        hidden: true
        },
        {
            field: "PositionName",
            title: "Должность",
            width: "250px"
        },
        {
            field: "EntryDate",
            title: "Дата начала работы",
            width: "115px",
            template: function (dataItem) { return dataItem.EntryDate != null ? kendo.toString(kendo.parseDate(dataItem.EntryDate, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') : "" }
        },
        {
            field: "DismDate",
            title: "Дата увольнения",
            width: "115px",
            template: function (dataItem) { return dataItem.DismDate != null ? kendo.toString(kendo.parseDate(dataItem.DismDate, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') : "" }
        },
        {
            field: "Experience",
            title: "Стаж",
            width: "110px"
        },
        //{
        //    field: "Date1",
        //    //title: kendo.toString(kendo.parseDate(data[0].RefPoints[i], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yy'),
        //    title: kendo.toString(kendo.parseDate(data[0].RefPoints[0], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy'),
        //    width: "110px",
        //    template: function (dataItem) {
        //        return dataItem.Dates[0] ? "<span style='color:green'>ЕСТЬ</span>" : "<span style='color:red'>НЕТ</span>"
        //    }
        //}
    ];


    for (var j = 0; j < data[0].RefPoints.length; j++) {
        const fieldStr = "Date" + String(j + 1);
        columns.push({
            field: fieldStr,
            title: kendo.toString(kendo.parseDate(data[0].RefPoints[j], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yy'),
            //width: "110px",
            width: "80px",
            template: function (dataItem) {
                return dataItem[fieldStr] ? "<span style='color:green'>ЕСТЬ</span>" : "<span style='color:red'>НЕТ</span>"
            }
        })
    }

    //if (data[0].RefPoints.length > 1) 
    //        columns.push({
    //            field: "Date2",
    //            title: kendo.toString(kendo.parseDate(data[0].RefPoints[1], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy'),
    //            width: "110px",
    //            template: function (dataItem) {
    //                return dataItem.Dates[1] ? "<span style='color:green'>ЕСТЬ</span>" : "<span style='color:red'>НЕТ</span>"
    //            }
    //        })
    //if (data[0].RefPoints.length > 2)
    //    columns.push({
    //        field: "Date3",
    //        title: kendo.toString(kendo.parseDate(data[0].RefPoints[2], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy'),
    //        width: "110px",
    //        template: function (dataItem) {
    //            return dataItem.Dates[2] ? "<span style='color:green'>ЕСТЬ</span>" : "<span style='color:red'>НЕТ</span>"
    //        }
    //    })


    $("#box_staff_turnover_employyes").append("<div id='grid_staff_turnover_employyes'></div>");
    $("#grid_staff_turnover_employyes").kendoGrid({
        toolbar: ["excel"],
       // excelExport: excelexport,
        excel: {
            allPages: true,
            fileName: "StaffTurnoverEmployees.xlsx"
        },
        columns: columns,
        selectable: "row",
        sortable: true,
        height: 650,
        resizable: true,
        navigatable: true,
        dataSource: data_source,
        dataBound: function (e) {
            $('#grid_staff_turnover_employyes .k-grid-content').height("100%");
        }
    });

    $("#grid_staff_turnover_employyes").data("kendoGrid").dataSource.sort(x => {
        x.Add(y => y.DepName).Ascending();
        x.Add(y => y.EmployeeFIO).Ascending();
        x.Add(y => y.PositionName).Ascending();
    });

    $("#grid_staff_turnover_employyes").data("kendoGrid").dataSource.read();





}

//получение квоты по подразделению и должности
function GetQuota(dep, posId){
    var data = $("#grid_quotas").data("kendoGrid").dataSource;

    let item = data.data().find(itm => itm.DepNum == dep);
    if (item){
        return item["Count" + String(posId)] != null ? item["Count" + String(posId)] : 0 ;
    }
    return 0;
}

function StaffTurnoverModeChange(mode) {

    WaitShow("staff_turnover_report");

    // mode = 0 - DepsOnly
    // mode = 1 - Deps and positions
    // mode = 2 - Depa and emloyees

    var data_source = []

    var staffTable = []
    //var staffFact = []


    //var month = $("#staff_turnover_month").data("kendoComboBox").value();
    //if (month == "" || month == null) {
    //    alert("Выберите месяц")
    //    return;
    //}
    //month = kendo.parseDate(month);
    //var date1 = new Date(month.getFullYear(), month.getMonth(), 1, 0, 0, 0, 0)
    //var date3 = new Date(date1)
    //date3.setMonth(date3.getMonth() + 1)
    //date3.setDate(date3.getDate() - 1)

    
    //var period = kendo.toString(date1, 'dd.MM.yy') + "-" + kendo.toString(date3, 'dd.MM.yy');

    var startDate = $("#datepickerstart_staff_turnover").data("kendoDatePicker").value();
    var endDate = $("#datepickerend_staff_turnover").data("kendoDatePicker").value();
    var diffDays = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24);

    var staffPositions = []
    $("#grid_staffing").data("kendoGrid").columns.forEach(_col => {
        if (_col.field.indexOf("Count") != -1) {
            var posId = _col.field.replace("Count", "")
            if (!isNaN(posId))
                staffPositions.push(Number(posId));
            }
    });

    var data = $("#grid_staffing").data("kendoGrid").dataSource;
    data.data().forEach(function (item) {
        var counts = [];
        var quotes = [];
        staffPositions.forEach(function (posId) {
            var field = "Count" + String(posId)
            let quota = GetQuota(item.DepNum, posId);
            let count = item[field] != null ? item[field] : 0;
            counts.push({posId: posId, count: count});
            quotes.push({posId: posId, count: quota});
        });
        
        counts.push({ posId: 0, count: item.CountAll != null ? item.CountAll : 0 });

        staffTable.push({
            DepNum: item.DepNum,
            DepName: item.DepName,
            Counts: counts,
            Quotes: quotes,
        });
    });
    //console.log(staffTable);

    //var objAll = {
    //    DepNum : 0,
    //    DepName: "ВСЕ РЕСТОРАНЫ",
    //    Counts: []
    //}
    //objAll.Counts.push({
    //    PosId: 0,
    //    PosName: null,
    //    StaffTable: 0,
    //    StaffCount: 0,
    //    StaffDismissed: 0
    //})
    var countsAll = []
    //countsAll.push({
    //    PosId: 0,
    //    PosName: null,
    //    StaffTable: 0,
    //    StaffCount: 0,
    //    StaffDismissed: 0
    //})

    var objCur = null

    var depsCount = 0;
    data = $("#grid_staff_turnover_employyes").data("kendoGrid").dataSource;
    var maxIndex = data.data().length - 1;
    
    data.data().forEach(function (item, index) {
        var isDismissed = (!item.Dates[item.Dates.length - 1])

        var dataPos = null
        var dataDep = null        
        data_source.forEach(function (dataItem) {
            if (mode == 1 && dataItem.DepNum == item.DepNum && dataItem.PosId == item.PositionId)
                dataPos = dataItem;
            if (dataItem.DepNum == item.DepNum && dataItem.PosId == 0)
                dataDep = dataItem;
        })

        if (dataDep == null) {
            dataDep = {
                DepNum: item.DepNum,
                DepName: item.DepName,
                PosId: 0,
                PosName: null,
                StaffTable: GetStaffTableCount(staffTable, item.DepNum, item.PositionId),
                StaffTableQuotes: GetStaffTableQuote(staffTable, item.DepNum, item.PositionId),
                StaffCount: 0,//1,
                StaffDismissed: (isDismissed ? 1 : 0)
            };
            data_source.push(dataDep)
            depsCount++;

            //для списка по должностям добавяем должности из ШР по которым нет сотрудников
            if (mode == 1){
                let depStaff = staffTable.find( i => i.DepNum == item.DepNum);
                if (depStaff){
                    if (depStaff.Counts) {
                        depStaff.Counts.forEach(pos => {
                            if (Number(pos.posId) > 0){
                                if (!data.data().some(emplPos => emplPos.DepNum == item.DepNum && emplPos.PositionId == pos.posId)){
                                    let curPosition = PositionList.find(e => e.Id == pos.posId);
                                    let curPositionCount = GetStaffTableCount(staffTable, item.DepNum, pos.posId);
                                    let curPositionQuotes = GetStaffTableQuote(staffTable, item.DepNum, pos.posId);
    
                                    //if (curPositionCount > 0 ){
                                        data_source.push({
                                            DepNum: item.DepNum,
                                            DepName: item.DepName,
                                            PosId: pos.posId,
                                            PosName: (curPosition ? curPosition.Name : "должность код: " + pos.posId),
                                            StaffTable: curPositionCount, //GetStaffTableCount(staffTable, item.DepNum, pos.posId),
                                            StaffTableQuotes: curPositionQuotes,
                                            StaffCount: 0,//1,
                                            StaffDismissed: 0
                                        });
                                    //}
                                } 
                            }                            
                        });
                    }
                }
            }
            //для списка по должностям добавяем должности из ШР по которым нет сотрудников
        }
        else {
            //dataDep.StaffCount += 1
            dataDep.StaffDismissed += (isDismissed ? 1 : 0);
            dataDep.StaffTable = GetStaffTableCount(staffTable, item.DepNum, null);
            dataDep.StaffTableQuotes = GetStaffTableQuote(staffTable, item.DepNum, null);
        } 

        if (mode == 1) {

            if (dataPos == null) {
                dataPos = {
                    DepNum: item.DepNum,
                    DepName: item.DepName,
                    PosId: item.PositionId,
                    PosName: item.PositionId == 2 ? "Повар" : item.PositionName,
                    StaffTable: GetStaffTableCount(staffTable, item.DepNum, item.PositionId),
                    StaffTableQuotes: GetStaffTableQuote(staffTable, item.DepNum, item.PositionId),
                    StaffCount: 0,//1,
                    StaffDismissed: (isDismissed ? 1 : 0)
                };
                data_source.push(dataPos);
            }
            else {
                //dataPos.StaffCount += 1
                dataPos.StaffDismissed += (isDismissed ? 1 : 0)
            }
        }       
    });

    if (depsCount > 1) {
        data_source.forEach(function (dataItem) {
            if (mode == 1 || dataItem.PosId == 0) {
                var cnt = countsAll.filter(_cnt => _cnt.PosId == dataItem.PosId)
                if (cnt.length > 0) {
                    cnt[0].StaffTable += dataItem.StaffTable;
                    cnt[0].StaffTableQuotes += dataItem.StaffTableQuotes;
                    cnt[0].StaffCount += dataItem.StaffCount;
                    cnt[0].StaffDismissed += dataItem.StaffDismissed;
                }
                else
                    countsAll.push({
                        PosId: dataItem.PosId,
                        PosName: dataItem.PosId == 0 ? null : dataItem.PosName,
                        StaffTable: dataItem.StaffTable,
                        StaffTableQuotes: dataItem.StaffTableQuotes,
                        StaffCount: 0,//dataItem.StaffCount,
                        StaffDismissed: dataItem.StaffDismissed
                    })
            }
        })

        countsAll.forEach(_pos => {
                data_source.push({
                    DepNum: 0,
                    DepName: "ИТОГО",
                    PosId: _pos.PosId,
                    PosName: _pos.PosName,
                    StaffTable: _pos.StaffTable,
                    StaffTableQuotes: _pos.StaffTableQuotes,
                    StaffCount: 0,//_pos.StaffCount,
                    StaffDismissed: _pos.StaffDismissed,
                })
        })

    }

    data = $("#grid_staff_turnover_employyes").data("kendoGrid").dataSource;
    data_source.forEach(function (dataItem) {
        var DepNum = dataItem.DepNum
        var PosId = dataItem.PosId

        var counts = []
        data.data().forEach(function (item, index) {
            if (counts.length == 0) {
                for (var j = 0; j < item.Dates.length; j++)
                    counts.push(0);
            }
            if ((DepNum == 0 || item.DepNum == DepNum)
                && (PosId == 0 || item.PositionId == PosId))
                for (var j = 0; j < item.Dates.length; j++)
                    counts[j] += (item.Dates[j] ? 1 : 0)
        })
        var sum = 0
        for (var j = 0; j < counts.length; j++)
            sum += counts[j];

        dataItem.StaffCount = Math.round(sum / counts.length)
    })


    



    

    var columns = [{
        field: "DepNum",
        title: "№ рест.",
        width: "80px",
        template: function (dataItem) {
            return dataItem.DepNum > 0
                ? dataItem.DepNum
                : ""
        }
    }, {
        field: "DepName",
        title: "Ресторан",
            width: "240px",
            template: function (dataItem) {
                return dataItem.PosId > 0
                    ? ("<span style='float:right'>" + dataItem.PosName + "</span>")
                    : ((mode == 1 ? "<b>" : "") + dataItem.DepName + (mode == 1 ? "</b>" : ""))
            }

    }, {
        field: "StaffTable",
        title: "ШР",
        width: "80px"
    }, {
        field: "StaffTableQuotes",
        title: "Квоты",
        width: "80px"
        },
            {
            field: "StaffPercent",
            title: "Укомплектованность",
            width: "100px",
            template: function (dataItem) { 
                return (dataItem.StaffTable + dataItem.StaffTableQuotes > 0) ? (String(Math.round(dataItem.StaffCount/(dataItem.StaffTable + dataItem.StaffTableQuotes) * 100)) + " %") : "" 
            }
        },
        {
            field: "StaffCount",
            title: "Среднесписочная численность по ресторану",
            width: "120px"
        },
        {
            field: "StaffDismissed",
            title: "Уволено ",//+period,
            width: "100px",
            //template: function (dataItem) { return "В разработке"}
        },
    {
        field: "StaffTurnover",
        title: "Текучесть за период %",
        template: function (dataItem) { return dataItem.StaffCount > 0 ? (String(Math.round((dataItem.StaffDismissed / dataItem.StaffCount) * 100)) + " %") : "" }
    },
    {
        field: "StaffForecast",
        title: "Прогноз",
        template: function (dataItem) {
            return dataItem.StaffCount > 0 ?
                (String(Math.round(((dataItem.StaffDismissed / dataItem.StaffCount) * 100 * (365.0 / diffDays)))) + " %") : ""
                //(String(Math.round(((dataItem.StaffDismissed / dataItem.StaffCount) * (365.0 / diffDays))) * 100) + " %") : ""
        }
        
    }
        ]




    $("#box_staff_turnover_report").append("<div id='grid_staff_turnover_report'></div>");
    $("#grid_staff_turnover_report").kendoGrid({
        toolbar: ["excel"],
        excelExport: excelexportStaffTurnover,
        excel: {
            allPages: true,
            fileName: "StaffTurnoverReport.xlsx"
        },
        columns: columns,
        selectable: "row",
        sortable: true,
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source,
        dataBound: function (e) {
            //$('#grid_staff_turnover_report .k-grid-content').height("100%");
            $('#grid_staff_turnover_report .k-grid-content').height("750px");
        }
    });

    $("#grid_staff_turnover_report").data("kendoGrid").dataSource.sort(x => {
        x.Add(y => y.DepName).Ascending();
        x.Add(y => y.EmployeeFIO).Ascending();
        x.Add(y => y.PositionName).Ascending();
    });

    $("#grid_staff_turnover_report").data("kendoGrid").dataSource.read();

    WaitHide("staff_turnover_report", null);
}

function GetStaffTableQuote(staffTable, DepNum, PosId) {
    var depRecs = DepNum != null ? staffTable.filter(_t => _t.DepNum == DepNum) : staffTable;
    if (depRecs.length > 0) {
        var sum = 0;
        depRecs.forEach(function (item) {
            var posRecs = (PosId != null && PosId != 0) ? item.Quotes.filter(_p => _p.posId == PosId) : item.Quotes;
            posRecs.forEach(function (itm) {
                sum += itm.count;
            })
        })
        return sum;
    }
    else
        return 0;   
}


function GetStaffTableCount(staffTable, DepNum, PosId) {
    var depRecs = DepNum != null ? staffTable.filter(_t => _t.DepNum == DepNum) : staffTable;
    if (depRecs.length > 0) {
        var sum = 0;
        depRecs.forEach(function (item) {
            var posRecs = (PosId != null && PosId != 0) ? item.Counts.filter(_p => _p.posId == PosId) : item.Counts;
            posRecs.forEach(function (itm) {
                sum += itm.count;
            })
        })
        return sum;
    }
    else
        return 0;   
}
//function GetObjStaffDismissed(objCur) {
//    var sum = 0;
//    objCur.Counts.forEach(function (item) { if (item.PosId != 0) sum += item.StaffDismissed })
//    return sum;
//}
//function GetObjStaffCount(objCur) {
//    var sum = 0;
//    objCur.Counts.forEach(function (item) { if (item.PosId != 0) sum += item.StaffCount })
//    return sum;
//}



//function StaffTurnoverEmployeeSortChange(mode) {

//}

















function RefreshStaffDecret() {

    var grid = $("#grid_staff_decret").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_staff_decret").remove();

    WaitShow("staff_decret");

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetStaffDecretEmployees",
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("staff_decret", null);
            if (typeof (data) == "object") {
                PrepareDataStaffDecret(data)
            };
        },
        error: function () {
            WaitHide("staff_decret", "Произошла ошибка при загрузке списка");
        }
    })


}


function PrepareDataStaffDecret(data_source) {
    //var data_source = [];

    function excelexport(e) {
        ;
    }

    $("#box_staff_decret").append("<div id='grid_staff_decret'></div>");
    $("#grid_staff_decret").kendoGrid({
        toolbar: ["excel",
            {
                name: "add",
                text: "Добавить",
                template: '<a class="k-button"' + (!userCanChangeOnlyDecret ? ' style="text-decoration: line-through"' : '') + '" href="\\#" onclick="AddStaffDecret()">' + symbolPlus + ' Добавить</a>'
            },
            //{
            //    name: "edit",
            //    text: "Редактировать",
            //    template: '<a class="k-button"' + (!userCanChangeData ? ' style="text-decoration: line-through"' : '') + '" href="\\#" onclick="EditStaffDecret()">' + symbolEdit + ' Редактировать</a>'
            //}
        ],
        excelExport: excelexport,
        excel: {
            allPages: true,
            fileName: "StaffDecret.xlsx"
        },//emplId pFirst_name pPosition_name pDivision_name pDate_entry pDate_dism
        columns: [{
            field: "StaffNum",
            title: "№ Staff",
            width: "100px"
        }, {
            field: "FIO",
            title: "ФИО"
            },
            {
                field: "DepName",
                title: "Подразделение",
                width: "170px"
            },
            {
                field: "PosName",
                title: "Должность",
                width: "200px"
            },
            {
                field: "EntryDate",
                title: "Дата начала работы",
                width: "115px",
                template: function (dataItem) { return dataItem.EntryDate != null ? kendo.toString(kendo.parseDate(dataItem.EntryDate, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') : "" }
            },
            {
                field: "DismDate",
                title: "Дата увольнения",
                width: "115px",
                template: function (dataItem) { return dataItem.DismDate != null ? kendo.toString(kendo.parseDate(dataItem.DismDate, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') : "" }
            }, {
            field: "Delete",
            title: "Удал.",
            width: "65px",
            template: function (dataItem) {
                return "<button class='k-primary k-button' style='width:30px;min-width:30px' onclick='DeleteStaffDecret(" + dataItem.StaffNum + ")'>" + symbolDelete + "</button>";
            },
                hidden: !userCanChangeOnlyDecret
        }],
        selectable: "row",
        sortable: true,
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source,
        //dataBound: function (e) {
        //    if (userCanChangeData) {
        //        var grid = this;
        //        grid.tbody.find("tr").dblclick(function (e) {
        //            var dataItem = grid.dataItem(this);
        //            EditDishKoef()
        //        });
        //    }
        //}
    });

    $("#grid_staff_decret").data("kendoGrid").dataSource.sort({ field: "StaffNum", dir: "asc" });
    $("#grid_staff_decret").data("kendoGrid").dataSource.read();
}



function DeleteStaffDecret(staffNum) {
    if (!userCanChangeOnlyDecret)
        return;
    if (!confirm("Удалить запись?"))
        return;

    var send_data = new Object();

    send_data.StaffNum = staffNum;

    $.ajax({
        url: "https://" + host + complaints + "/api/Info/DeleteStaffDecretEmployee",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(send_data),
        success: function (dataResp) {
            var newDataSrc = [];
            var data = $("#grid_staff_decret").data("kendoGrid").dataSource;
            data.data().forEach(function (item) {
                if (item.StaffNum !== dataResp.StaffNum) newDataSrc.push(
                    {
                        StaffNum: item.StaffNum,
                        FIO: item.FIO,
                        PosName: item.PosName,
                        DepName: item.DepName,
                        EntryDate: item.EntryDate,
                        DismDate: item.DismDate
                    })
            });
            $("#grid_staff_decret").data("kendoGrid").setDataSource(newDataSrc);

        },
        error: function () {
            alert("Ошибка удаления!");
        }
    });
}


function AddStaffDecret() {
    if (!userCanChangeOnlyDecret)
        return;

    var staffNum = prompt("Введите номер Staff")
    if (staffNum != null) {
        if (isNaN(staffNum)) {
            alert("Неправильный номер")
            return;
        }
        var exists = false;
        var data = $("#grid_staff_decret").data("kendoGrid").dataSource;
        data.data().forEach(function (item) { if (Number(item.StaffNum) == Number(staffNum)) exists = true })
        if (exists) {
            alert("Номер уже существует в списке")
            return;
        }


        var send_data = new Object();

        send_data.StaffNum = staffNum;

        $.ajax({
            url: "https://" + host + complaints + "/api/Info/" + "AddStaffDecretEmployee",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(send_data),
            success: function (dataResp) {
                var newDataSrc = [];
                data.data().forEach(function (item) {
                    newDataSrc.push({
                        StaffNum: item.StaffNum,
                        FIO: item.FIO,
                        PosName: item.PosName,
                        DepName: item.DepName,
                        EntryDate: item.EntryDate,
                        DismDate: item.DismDate
                    })
                });
                newDataSrc.push({
                    StaffNum: dataResp.StaffNum,
                    FIO: dataResp.FIO,
                    PosName: dataResp.PosName,
                    DepName: dataResp.DepName,
                    EntryDate: dataResp.EntryDate,
                    DismDate: dataResp.DismDate
                     });
                $("#grid_staff_decret").data("kendoGrid").setDataSource(newDataSrc);
            },
            error: function () {
                alert("Ошибка записи!");
            }
        });


    }
}


function SelectStaffTurnoverDeps() {
    //staff_turnover_deps
    var grid_staffturnover_deps = $("#grid_staffturnover_deps").data("kendoGrid");
    if (grid_staffturnover_deps) {
        grid_staffturnover_deps.destroy();
    }
    $("#grid_staffturnover_deps").remove();

    var selectedDeps = $("#staff_turnover_deps").val().split(',');

    var deps = DepartmentList.filter(_dep => _dep.isActive);
    deps.sort(function (a, b) { return a.DepNum - b.DepNum; });
    var data_source = deps.map(function (_dep) { return { Sel: selectedDeps.indexOf(String(_dep.DepNum)) != -1, Num: _dep.DepNum, Name: _dep.DepName, Place: (_dep.Place.toLowerCase().trim() == "город" ? null : "Аэро") }; });
    //var data_source = deps.map(function (_dep) { return { Sel: selectedDeps.indexOf(String(_dep.DepNum)) != -1, Num: _dep.DepNum, Name: _dep.DepName, Place: _dep.Place }; });

    //var depsOther = [];
    //var depsFromText = $("#forecast_deps").val().trim().split(",");
    //depsFromText.forEach(function (item) {
    //    if (item != null) {
    //        var txt = item.trim();
    //        if (item.length > 0 && !isNaN(item)) {
    //            if (deps.filter(_dep => _dep.DepNum == item).length == 0)
    //                depsOther.push(item);
    //        }
    //    }
    //});
    //$("#forecast_deps_other").val(depsOther.join(','));


    $("#box_staffturnover_deps").append("<div id='grid_staffturnover_deps'></div>");
    $("#grid_staffturnover_deps").kendoGrid({
        /*toolbar: ["excel"],*/
        columns: [
            {
                field: "Sel",
                title: "Исп.",
                width: "60px",
                editable: true,
                template: function (dataItem) {
                    return '<input type="checkbox" onclick="StaffTurnoverDepsSet(' + String(dataItem.Num) + ')" id="grid_staff_turnover_deps_sel_' + String(dataItem.Num) + '" style="width:20px;height:20px;" data-bind="source: Sel" ' + (dataItem.Sel ? 'checked="checked"' : "") + ' />';
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
    $("#grid_staffturnover_deps").data("kendoGrid").dataSource.read();

    $("#window_staffturnover_deps").data("kendoWindow").center().open();


}
//StaffTurnoverDepsSet




function StaffTurnOverDepsSelectAero() {
    var data = $("#grid_staffturnover_deps").data("kendoGrid").dataSource;
    data.data().forEach(function (item) { item.Sel = (item.Place != null) });
    $("#grid_staffturnover_deps").data("kendoGrid").setDataSource(data);
}
function StaffTurnOverDepsSelectCity() {
    var data = $("#grid_staffturnover_deps").data("kendoGrid").dataSource;
    data.data().forEach(function (item) { item.Sel = (item.Place == null) });
    $("#grid_staffturnover_deps").data("kendoGrid").setDataSource(data);
}
function StaffTurnOverDepsDeselectAll() {
    var data = $("#grid_staffturnover_deps").data("kendoGrid").dataSource;
    data.data().forEach(function (item) { item.Sel = false });
    $("#grid_staffturnover_deps").data("kendoGrid").setDataSource(data);
}
function StaffTurnOverDepsSelectAll() {
    var data = $("#grid_staffturnover_deps").data("kendoGrid").dataSource;
    data.data().forEach(function (item) { item.Sel = false });
    $("#grid_staffturnover_deps").data("kendoGrid").setDataSource(data);

    $("#window_staffturnover_deps").data("kendoWindow").center().close();
}
function StaffTurnoverDepsSet(depNum) {
    var data = $("#grid_staffturnover_deps").data("kendoGrid").dataSource;
    var selVal = $("#grid_staff_turnover_deps_sel_" + String(depNum)).is(":checked");
    data.data().forEach(function (item) { if (item.Num == depNum) item.Sel = selVal });
    //$("#grid_forecast_deps").data("kendoGrid").setDataSource(data);
}
function StaffTurnoverDepsOk() {
    var data = $("#grid_staffturnover_deps").data("kendoGrid").dataSource;
    var deps = [];
    var hasNot = false;
    data.data().forEach(function (item) { if (item.Sel) deps.push(item.Num); else hasNot = true; });

    if (hasNot && deps.length > 0) {
        //var depsOther = $("#forecast_deps_other").val().trim().split(",");
        //depsOther.forEach(function (item) {
        //    if (item != null) {
        //        var txt = item.trim();
        //        if (item.length > 0 && !isNaN(item)) {
        //            deps.push(item);
        //        }
        //    }
        //});
        $("#staff_turnover_deps").val(deps.join(','));
    }
    else
        $("#staff_turnover_deps").val("Все");
}



function excelexportStaffTurnover(e) {

    var startDate = $("#datepickerstart_staff_turnover").data("kendoDatePicker").value();
    var endDate = $("#datepickerend_staff_turnover").data("kendoDatePicker").value();
    var diffDays = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24);

    var sheet = e.workbook.sheets[0];

    var row0 = sheet.rows[0];

    var iRow = 1;
    var data = $("#grid_staff_turnover_report").data("kendoGrid").dataSource;
    data.data().forEach(function (dataItem) {
        var row = sheet.rows[iRow];

        if (dataItem.PosId > 0) {
            var cell = row.cells[1];
            cell.value = dataItem.PosName
            cell.textAlign = "right";
        }

        row.cells[3].value  = dataItem.StaffTable > 0 ? (String(Math.round(dataItem.StaffCount / dataItem.StaffTable * 100)) + " %") : ""

        row.cells[6].value  = dataItem.StaffCount > 0 ? (String(Math.round((dataItem.StaffDismissed / dataItem.StaffCount) * 100)) + " %") : "" 

        row.cells[7].value  = dataItem.StaffCount > 0 ?
                    (String(Math.round(((dataItem.StaffDismissed / dataItem.StaffCount) * 100 * (365.0 / diffDays)))) + " %") : ""


        iRow++;
    });




}


















function RefreshStaffVacation() {

    var grid = $("#grid_staff_vacation").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_staff_vacation").remove();

    WaitShow("staff_vacation");

    var dep = $("#staff_vacation_dep").data("kendoComboBox").value();
    var filtersGet = "";
    if (dep != "ALL" && dep != "" && dep != null) {
        filtersGet = "?CodShop=" + String(dep)
    }

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetStaffEmployeeVacations" + filtersGet,
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("staff_vacation", null);
            if (typeof (data) == "object") {
                PrepareDataStaffVacation(data)
            };
        },
        error: function () {
            WaitHide("staff_vacation", "Произошла ошибка при загрузке списка");
        }
    })


}


function PrepareDataStaffVacation(data_source) {
    //var data_source = [];

    function excelexport(e) {
        ;
    }

    var dt = new Date()
    data_source.forEach(function (item) {
        item.NowDate = dt;
        var Periods = "";
        if (item.Vacations != null)
            item.Vacations.forEach(function (vac) {
                Periods += kendo.toString(kendo.parseDate(vac[0], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy')
                   " - " + kendo.toString(kendo.parseDate(vac[1], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "\r\n"
            })
        item.Periods = Periods;
    })
    //NowDate
    //Periods

    $("#box_staff_vacation").append("<div id='grid_staff_vacation'></div>");
    $("#grid_staff_vacation").kendoGrid({
        toolbar: ["excel"],
        excelExport: excelexport,
        excel: {
            allPages: true,
            fileName: "StaffVacation.xlsx"
        },//emplId pFirst_name pPosition_name pDivision_name pDate_entry pDate_dism
        columns: [{
            field: "StaffNum",
            title: "№ Staff",
            width: "100px"
        }, {
            field: "FIO",
            title: "ФИО"
        },
        {
            field: "DepName",
            title: "Подразделение",
            width: "170px"
        },
        {
            field: "PosName",
            title: "Должность",
            width: "200px"
        },
        {
            field: "EntryDate",
            title: "Дата начала работы",
            width: "115px",
            template: function (dataItem) { return dataItem.EntryDate != null ? kendo.toString(kendo.parseDate(dataItem.EntryDate, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') : "" }
        },
        {
            field: "DismDate",
            title: "Дата увольнения",
            width: "115px",
            template: function (dataItem) { return dataItem.DismDate != null ? kendo.toString(kendo.parseDate(dataItem.DismDate, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') : "" }
            },
            {
                field: "NowDate",
                title: "Текущая дата",
                width: "115px",
                template: function (dataItem) { return kendo.toString(kendo.parseDate(dataItem.NowDate, 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') }
            },
            {
                field: "Periods",
                title: "Периоды",
                width: "265px",
                template: function (dataItem) {
                    var result = "";

                    if (dataItem.Vacations != null)
                        dataItem.Vacations.forEach(function (vac, index) {
                            result += kendo.toString(kendo.parseDate(vac[0], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') +
                            " - " + kendo.toString(kendo.parseDate(vac[1], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') +
                                "&nbsp;" + "<a style='cursor:pointer;color:DarkRed;' onclick='DeleteStaffVacation(" + String(dataItem.StaffNum) + "," + String(index) + ")'>❌</a>"
                            if (index < dataItem.Vacations.length - 1)
                                result += "<br/>"
                        })

                    return result + "&nbsp;&nbsp;&nbsp;" +
                        "<a style='cursor:pointer;color:DarkGreen;font-style:bold;' onclick='AddStaffVacation(" + String(dataItem.StaffNum) + ")'>➕</a>";
                }
            },
            {
                field: "DaysUsed",
                title: "Использовано",
                width: "75px"
            },
            {
                field: "DaysLeft",
                title: "Осталось",
                width: "75px"
            },
            {
                field: "DaysAccum",
                title: "Накоплено",
                width: "75px"
            }
        ],
        selectable: "row",
        sortable: true,
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source,
        //dataBound: function (e) {
        //    if (userCanChangeData) {
        //        var grid = this;
        //        grid.tbody.find("tr").dblclick(function (e) {
        //            var dataItem = grid.dataItem(this);
        //            EditDishKoef()
        //        });
        //    }
        //}
    });

    //$("#grid_staff_vacation").data("kendoGrid").dataSource.sort({ field: "StaffNum", dir: "asc" });
    $("#grid_staff_vacation").data("kendoGrid").dataSource.read();
}



function DeleteStaffVacation(staffNum, periodIndex) {
    if (!userCanChangeOnlyVacations)
        return;
    if (!confirm("Удалить запись?"))
        return;

    var FStartDate
    var FEndDate

    var data = $("#grid_staff_vacation").data("kendoGrid").dataSource;
    data.data().forEach(function (item, index) {
        if (item.StaffNum == staffNum) {
            FStartDate = kendo.toString(kendo.parseDate(item.Vacations[periodIndex][0], 'yyyy-MM-ddTHH:mm:ss'), 'yyyyMMdd')
            FEndDate = kendo.toString(kendo.parseDate(item.Vacations[periodIndex][1], 'yyyy-MM-ddTHH:mm:ss'), 'yyyyMMdd')
        }
    })

    if (FStartDate == null)
        return;

    var send_data = new Object();

    send_data.StaffNum = Number(staffNum);
    send_data.Vacations = []
    send_data.Vacations[0] = [FStartDate, FEndDate]        

    $.ajax({
        url: "https://" + host + complaints + "/api/Info/DeleteStaffEmployeeVacation",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(send_data),
        success: function (dataResp) {
            if (dataResp[0] == 0) {
                //updateVacationData(send_data.StaffNum, dataResp[1])
                var newData = []
                var data = $("#grid_staff_vacation").data("kendoGrid").dataSource;
                data.data().forEach(function (item, index) {
                    if (item.StaffNum == send_data.StaffNum) {
                        item.DaysUsed = dataResp[1].DaysUsed
                        item.DaysAccum = dataResp[1].DaysAccum
                        item.DaysLeft = dataResp[1].DaysLeft
                        item.Vacations = dataResp[1].Vacations

                        var Periods = "";
                        if (item.Vacations != null)
                            item.Vacations.forEach(function (vac) {
                                Periods += kendo.toString(kendo.parseDate(vac[0], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy')
                                " - " + kendo.toString(kendo.parseDate(vac[1], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "\r\n"
                            })
                        item.Periods = Periods;
                    }
                    newData.push(item)
                })
                $("#grid_staff_vacation").data("kendoGrid").setDataSource(newData)
                $("#grid_staff_vacation").data("kendoGrid").dataSource.read();
            }
            else
                alert(dataResp[1]);
        },
        error: function () {
            alert("Ошибка удаления!");
        }
    });
}


function AddStaffVacation(staffNum) {
    if (!userCanChangeOnlyVacations)
        return;
    $("#staffvacation_staffnum").val(staffNum)
    $("#window_staffvacation_dates").data("kendoWindow").center().open();
    
}


function StaffVacationDatesAdd() {
    var staffNum = $("#staffvacation_staffnum").val()
    var SD = $("#datepickerstart_staffvacation").val().split('/');
    var ED = $("#datepickerend_staffvacation").val().split('/');
    var FStartDate = SD[2] + SD[1] + SD[0];
    var FEndDate = ED[2] + ED[1] + ED[0];




        var send_data = new Object();

    send_data.StaffNum = Number(staffNum);
    send_data.Vacations = []
    send_data.Vacations[0] = [FStartDate, FEndDate]

        $.ajax({
            url: "https://" + host + complaints + "/api/Info/" + "AddStaffEmployeeVacation",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(send_data),
            success: function (dataResp) {
                if (dataResp[0] == 0) {

                    var newData = []
                    var data = $("#grid_staff_vacation").data("kendoGrid").dataSource;
                    data.data().forEach(function (item, index) {
                        if (item.StaffNum == send_data.StaffNum) {
                            item.DaysUsed = dataResp[1].DaysUsed
                            item.DaysAccum = dataResp[1].DaysAccum
                            item.DaysLeft = dataResp[1].DaysLeft
                            item.Vacations = dataResp[1].Vacations

                            var Periods = "";
                            if (item.Vacations != null)
                                item.Vacations.forEach(function (vac) {
                                    Periods += kendo.toString(kendo.parseDate(vac[0], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy')
                                    " - " + kendo.toString(kendo.parseDate(vac[1], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "\r\n"
                                })
                            item.Periods = Periods;
                        }
                        newData.push(item)
                    })
                    $("#grid_staff_vacation").data("kendoGrid").setDataSource(newData)
                    $("#grid_staff_vacation").data("kendoGrid").dataSource.read();


                    //updateVacationData(send_data.StaffNum, dataResp[1])
                    $("#window_staffvacation_dates").data("kendoWindow").center().close();
                }
                else
                    alert(dataResp[1]);
            },
            error: function () {
                alert("Ошибка записи!");
            }
        });
   
}

function updateVacationData(staffNum, data) {
    var newData = []
    var data = $("#grid_staff_vacation").data("kendoGrid").dataSource;
    data.data().forEach(function (item, index) {
        if (item.StaffNum == staffNum) {
            item.DaysUsed = data.DaysUsed
            item.DaysAccum = data.DaysAccum
            item.DaysLeft = data.DaysLeft
            item.Vacations = data.Vacations

            var Periods = "";
            if (item.Vacations != null)
                item.Vacations.forEach(function (vac) {
                    Periods += kendo.toString(kendo.parseDate(vac[0], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy')
                    " - " + kendo.toString(kendo.parseDate(vac[1], 'yyyy-MM-ddTHH:mm:ss'), 'dd.MM.yyyy') + "\r\n"
                })
            item.Periods = Periods;
        }
        //newData.push(item)
    })
    //$("#grid_staff_vacation").data("kendoGrid").dataSource.update();
    //$("#grid_staff_vacation").data("kendoGrid").refresh();
    $("#grid_staff_vacation").data("kendoGrid").setDataSource($("#grid_staff_vacation").data("kendoGrid").dataSource)

    //$("#grid_staff_vacation").data("kendoGrid").dataSource.sort({ field: "StaffNum", dir: "asc" });
    $("#grid_staff_vacation").data("kendoGrid").dataSource.read();

    //$("#grid_staff_vacation").data("kendoGrid").refresh();
}

//******************************************************************************************************************************************
//**************** Вкладка "Квоты" 

function RefreshQuotas() {
    var grid = $("#grid_quotas").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_quotas").remove();

    WaitShow("quotas");

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetQuotasTable",
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("quotas", null);
            if (typeof (data) == "object") {
                //console.log(data);
                if (data.Positions){
                    PositionList = data.Positions;
                }
                PrepareQuotasData(data)
            };
        },
        error: function () {
            WaitHide("quotas", "Произошла ошибка при загрузке квот!");
        }
    })
}

function PrepareQuotasData(data) {
    var data_source = [];
    
    var columns = [{
        field: "DepName",
        title: "Ресторан",
        width: "200px",
        height: "53px",            
        //locked: true,
        //lockable: false,
        headerAttributes: { style: "white-space: normal; vertical-align: top;" },
        editable: function () { return false; }
    },{
        field: "CountAll",
        title: "Всего",
        width: "80px",
        height: "53px",            
        //locked: true,
        //lockable: false,
        headerAttributes: { style: "white-space: normal; vertical-align: top;" },
        editable: function () { return false; },
        template: function (dataItem) {
            var summ = 0;
            Object.keys(dataItem).forEach(key => { if (key.indexOf("CountAll") == -1 && key.indexOf("Count") != -1 && dataItem[key] != null) summ += Number(dataItem[key]); });
            return "<b>" + String(summ) + "</b>";
        }
    }];

    data.Positions.forEach(function (pos) {
        columns.push({
            field: "Count" + String(pos.Id),
            title: pos.Name,
            width: "100px",
            height: "53px",            
            locked: false,
            lockable: false,
            headerAttributes: { style: "white-space: normal; vertical-align: top;" },
            editable: function () { return userCanChangeOnlyStaffTableData; }
        });
    });

    data.Deps.forEach(function (dep) {
        var obj = new Object()
        obj["DepNum"] = dep.Id
        obj["DepName"] = dep.Name
        obj["DepName2"] = dep.Name

        var records = data.Records.filter(_rec => _rec.DepNum == dep.Id);
        records.forEach(function (item) {
            if (item.PosId != null)
                obj["Count" + String(item.PosId)] = item.Value;
        });
        data_source.push(obj);
    });

    columns.push({
        field: "CountAll2",
        title: "Всего",
        width: "80px",
        headerAttributes: { style: "white-space: normal; vertical-align: top;" },
        editable: function () { return false; },
        template: function (dataItem) {
            var summ = 0;
            Object.keys(dataItem).forEach(key => { if (key.indexOf("CountAll") == -1 && key.indexOf("Count") != -1 && dataItem[key] != null) summ += Number(dataItem[key]); });
            return "<b>" + String(summ) + "</b>";
        }
    });
    columns.push({
        field: "DepName2",
        title: "Ресторан",
        width: "200px",
        headerAttributes: { style: "white-space: normal; vertical-align: top;" },
        editable: function () { return false; }
    });

    $("#box_quotas").append("<div id='grid_quotas'></div>");
    $("#grid_quotas").kendoGrid({
        toolbar: [
            {template: '<a class="k-button" href="\\#" onclick="return RefreshQuotas();">Обновить</a>'},
            "excel",            
        ],
        excel: {
            allPages: true,
            fileName: "Quotas.xlsx"
        },
        columns: columns,
        sortable: true,
        selectable: "cell",//"row",
        height: 550,
        width: "100%",
        scrollable: true,
        resizable: true,
        navigatable: true,
        dataSource: data_source,
        dataBound: function () {
            $('#grid_quotas .k-grid-content').height("90%");
            //$('#grid_quotas k-grid-content-locked').width("280px");
            //$('#grid_quotas k-grid-content-locked').height("90%");
            //$('#grid_quotas .k-grid-content-locked').width("100%");
            //$('#grid_quotas .k-grid-content').width("100%");  
            //$('#grid_quotas').data('kendoGrid').refresh();
        },
        editable: true,
        cellClose: function (e) {

            var grid = e.sender;
            var cellIndex = grid.select().index();
            var col = grid.columns[cellIndex].field;
            var posId = Number(col.replace("Count",""))
            var dep = e.model["DepNum"];

            if (e.model[col] != grid_prev_val) {
                var promptVal = e.model[col];
                var cancel = false;

                var badNum = false;
                if (!isNaN(promptVal) && promptVal != "" && promptVal != null) {
                    var asNum = Number(promptVal)
                    if (asNum < 0)
                        badNum = true;
                }
                while ((!cancel && promptVal != null && isNaN(promptVal)) || badNum || String(promptVal).indexOf('.') != -1 || String(promptVal).indexOf(',') != -1) {
                    badNum = false;
                    var res = prompt("Введите целое число или пустое значение", promptVal);
                    if (res === null)
                        cancel = true;
                    else {
                        promptVal = res;
                    }
                }
                if (cancel) {
                    e.model[col] = grid_prev_val;
                    $('#grid_quotas').data('kendoGrid').refresh();
                    $(window).off('beforeunload');
                } 
                else {

                    var send_data = { DepNum: dep, Value: (promptVal != null && promptVal != "") ? parseFloat(promptVal) : null, PosId: posId };
                    $.ajax({
                        url: "https://" + host + "/complaints/api/info/PostQuotasTableValue",
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(send_data),
                        success: function (data) {
                            e.model["Count" + String(data.PosId)] = data.Value;
                            var lastRowUid = e.model.uid;
                            var row = $("#grid_quotas").data("kendoGrid").table.find("[data-uid=" + lastRowUid + "]");
                            $(row).children().eq(cellIndex).html(kendo.toString(data.Value, "#.##"));

                            var summ = 0;
                            Object.keys(e.model).forEach(key => { if (key.indexOf("CountAll") == -1 && key.indexOf("Count") != -1 && e.model[key] != null) summ += Number(e.model[key]); });
                            var allHtml =  "<b>" + String(summ) + "</b>";
                            $(row).children().eq(1).html(allHtml);
                            $(row).children().eq($(row).children().length - 2).html(allHtml);
                        },
                        error: function () {
                            e.model.Value = grid_prev_val;
                            $('#grid_quotas').data('kendoGrid').refresh();
                            alert("Произошла ошибка при записи значения!");
                        }
                    });

                    $(window).off('beforeunload');
                }
            }
            else {
                $(window).off('beforeunload');
            }                
        },
        beforeEdit: function (e) {
            var grid = e.sender;
            var cellIndex = grid.select().index();
            var col = grid.columns[cellIndex].field;

            grid_prev_val = e.model[col];
            $(window).on('beforeunload', function () {
                return "В случае подтверждения закрытия окна браузера, все несохраненные данные будут утеряны!";
            });
        }
    });

    $("#grid_quotas").data("kendoGrid").dataSource.read();
    //$('#grid_quotas').data('kendoGrid').refresh();
}


