
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

let currentRecipe = null;
let FilePDF = null;
let FilePDFFree = null;
let notificationWidget;
let resetBTKState = false;

let Ingredients = [];

let usersBTK = ["manager", "r.m.valladares@coffeemania.ru", "t.andreeva@coffeemania.ru", "n.yangildina@coffeemania.ru"];
//var activateButtonLabel = ["Актив.", "Деакт."]

    $(document).ready(function () {
		host = window.location.hostname;

        // При отладке на локальном, возвращать host вместе с портом 
        if (host == "localhost")
        {
            host = window.location.host;
            complaints = "";
        }

		//SA
		kengoObjectsInit();

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

        //$("#window_login").data("kendoWindow").center().open();

        //проверка авторизации
        checkUserLogin();														 
        
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
    var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}

//проверка (авторизация) пользователя по cookies
function checkUserLogin() {
	//console.log("checkUserLogin");        
	$.ajax({
		url: "https://" + host + complaints +"/api/auth/checkUser",
		type: "GET",
		success: function (data) {
			//console.log(data);
			if (typeof (data) == "object") {
				if (data.Id == -1) {
					$("#window_login").data("kendoWindow").center().open();
				}
				else {
					prepareUserData(data);
					//console.log("user from cookies: ok");
					initInterface(data);
				}
			} else {
				$("#window_login").data("kendoWindow").center().open();
			}
		},
		error: function(error){
			$("#window_login").data("kendoWindow").center().open();
		}
	});        
};
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
                    prepareUserData(data);
									  

											
											  
													

														   

								  

													
																	   

																  


													   
																 
																	 
															   
																 

														   

                    $("#window_login").data("kendoWindow").center().close();
                    $("#login-message").text("");

                    initInterface(data);
                }
            } else {
                onExit();
            }
        }
    });
};

// загрузка данных о пользователе из ответа сервера
function prepareUserData(data){
    user_id = data.Id;
																						 
														   
					   

    RoleUser = new Object();
    RoleUser.UserId = data.Id;
    RoleUser.Login = data.Login,
    RoleUser.FirstName = data.FirstName,
    RoleUser.LastName = data.LastName,

    RoleUser.AvailableFunction = [];
														
					 

    data.FuncList.forEach(function (item) {
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
    RoleUser.CheckLists = data.CheckLists;
}

function initInterface(data){
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

    $("#box_grid").css("display", "");
    $("#tabs").css("display", "");
    $("#tab-content").css("display", "block");
																	 
					 

    getAllData(true, false);

    if ($.cookie("current_tab")) {
        $('#tabs a[href="' + $.cookie("current_tab") + '"]').tab('show');
        if ($.cookie("current_tab") == "#tabs-8") {
            if (!GestoriInredients){
                getCalculationsList();
                getMenuCat();
                getIngredients();
            }
        }
    }

    var triggerTabList = [].slice.call(document.querySelectorAll('#tabs a'));
    triggerTabList.forEach(function (triggerEl) {
        var tabTrigger = new bootstrap.Tab(triggerEl);
        triggerEl.addEventListener('click', function (event) {
            //console.log(event);
            //console.log(event.srcElement.hash);
            $.cookie("current_tab", event.srcElement.hash, { expires : 30 });

            if (event.srcElement.hash == "#tabs-8") {
                if (!GestoriInredients){
                    getCalculationsList();
                    getMenuCat();
                    getIngredients();
                }
					
						 
            }
        });
    });
}


function onExit() {
    user_id = -1;
	$.removeCookie("id", {path: "/"});								  

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
    getDirectories();
}

function getUserDepLinks(_executeChain, _initTable, _refreshTable, _refreshAllTables = false) {
    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetUserDepLinks",
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
        url: "https://" + host + "/complaints/api/info/GetRecipeChanges?" + filtersGet,
        global: false,
        type: "GET",
        success: function (data) {
            WaitHide("recipe_changes", null);
            if (typeof (data) == "object") {
                //console.log(data);
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

        //удаляем столбец БТК
        for (var rowIndex = 0; rowIndex < sheet.rows.length; rowIndex++) {
            sheet.rows[rowIndex].cells.shift();
        }
        sheet.columns[0].width = 105;

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
        columns: [            
        { 
            hidden: !isBTKUser(),
            field: "btk",
            title: "БТК",
                width: "60px",
                template: function (dataItem) {
                    if (String(dataItem.NumAkt).startsWith("88")){
                        return dataItem.btk ? dataItem.btk : getWaitImage();
                    }
                    return "";
                },
            attributes: {style: "text-align: center;"},
        }, {
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

    getInfoBTK();
}


function ShowCalculation(barCode, numAkt, author) {
    var grid = $("#grid_technology").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_technology").remove();

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetRecipe?CodGood=" + barCode + "&NumAkt=" + numAkt,
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {
                //console.log(data);
                PrepareCalsData(data, author);
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

    currentRecipe = {        
        Recipe: {
            LocCode: data.LocCode, 
            Rows: data_source},
    };
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
        url: "https://" + host + "/complaints/api/info/GetIncomingInvoices?" + filtersGet,
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
        url: "https://" + host + "/complaints/api/info/GetWriteoffs?" + filtersGet,
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
        url: "https://" + host + "/complaints/api/info/GetReworked?" + filtersGet,
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
    $("#box_" + page).append('<img id="gridWait_' + page + '" style="width: 10%; margin-top:50px;margin-left:45%; margin-right:45%" src="https://' + host + '/feedback/wait5.gif" />');
}

function WaitHide(page, msg) {
    $("#gridWait_" + page).remove();
    if(msg != null)
        alert(msg);
    $("#grid_" + page).css("display", "block");
}






function print(divId, title) {
    newWin = window.open("");

    $("#technology_name_prn").html($("#technology_name").val());
    $("#technology_quant_prn").html($("#technology_quant").val());
    $("#technology_calc_num_prn").html($("#technology_calc_num").val());
    $("#technology_description_prn").html($("#technology_description").val());
    $("#technology_author_prn").html($("#technology_author").val());
    $("#technology_text_prn").html($("#technology_text").val());
    $("#technology_workdate_prn").html($("#technology_workdate").val());

    $("#box_technology .k-grid-content").css({
        "overflow-y": "hidden"
    });
    $("#box_technology .k-grid-header").css({
        "padding-right": "0px"
    });

    $("#box_technology_prn").html($("#box_technology").html());    
    $("#box_technology .k-grid-content").css({
        "overflow-y": "scroll"
    });
    $("#box_technology .k-grid-header").css({
        "padding-right": "17px"
    });

    var divToPrint = document.getElementById('window_technology_prn');
    newWin.document.write(divToPrint.outerHTML);
    newWin.document.getElementById('window_technology_prn').style = "";

    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = '../styles/kendo.common.min.css';
    newWin.document.head.appendChild(link);

    link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = '../styles/kendo.default.min.css';
    newWin.document.head.appendChild(link);
    
    setTimeout(function () {
        newWin.print();
        newWin.close();
    }, 1000);
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
        url: "https://" + host + "/complaints/api/info/GetProducedTypeForBarcod?CodGood=" + barc,
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

//*************************** "БТК"

//загрузка информации по документам БТК
function getInfoBTK(rowIndex = -1) {
    let source = $("#grid_recipe_changes").data("kendoGrid");
    //console.log(source);
    source.dataSource.data().forEach(function (item, index){
        if (rowIndex == -1 || rowIndex == index){
            if (String(item.NumAkt).startsWith("88")){
                $.ajax({
                    url: "https://" + host + "/complaints/api/igestori/GetListTechcard?barcode=" + item.LocCode,
                    type: "GET",
                    success: function (data) {
                        //console.log(data);
                        item.btk = '<span style="cursor:pointer;color:red;" class="k-icon k-i-file-add" title="БТК отсутствует \n\nНажмите для создания нового БТК" onclick="openWindowBTK(' + index + ');"></span>';
                        if (typeof (data) == "object") {
                            if (data.length > 0){                            
                                item.btk = '<span style="cursor:pointer;color:' + getStatusBTKColor(data[0].state) + ';" class="k-icon k-i-file-txt" title="' + getBTKTitle(data[0]) +'" onclick="openWindowBTK(' + index + ');"></span>';

                                let date_chg = new Date(item.DateChanges).getTime();
                                let date_btk = new Date(data[0].lastModifiedDate.split(" ")[0].replaceAll(".", "-")).getTime();
                                let diff = Math.round((date_chg - date_btk) / (1000 * 3600 * 24));
                                if (diff > 0) {
                                    let title = "Дата изменения техкарты больше даты изменения карточки БТК на " + diff + " " + getNoun(diff, "день", "дня", "дней") + "!";
                                    item.btk += ' <span style="color:grey;" class="k-icon k-i-bell" title="' + title +'"></span>';    
                                }
                            }
                        }            		  
                        source.refresh();
                    }
                });        
            }
        }
    });    
}

//открытие окна "БТК"
function openWindowBTK(index){
    let data = $("#grid_recipe_changes").data("kendoGrid").dataSource.data()[index];
    currentRecipe = {
        Index: index,
        RecipeChange: data,
    };

    $("#win_btk_brand").data("kendoDropDownList").select(-1);
    $("#win_btk_category").data("kendoDropDownList").select(-1);
    $("#win_btk_author").data("kendoDropDownList").setDataSource([]);
    //$("#win_btk_author_src").html(" ");
    $("#win_btk_author_src").html("Автор в ТК: " + currentRecipe.RecipeChange.Work);
    $("#win_btk_weight").val("");
    $("#win_btk_cost").val("");
    $("#win_btk").data("kendoWindow").title( data.LocCode + " - " + data.Name);
    $("#win_btk").data("kendoWindow").center().open();    
    $("#win_btk_cost_recalc").html("Рассчитать");

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetRecipe?CodGood=" + data.LocCode + "&NumAkt=" + data.NumAkt,
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {
                //console.log(data);
                currentRecipe.Recipe = data;
            };
        }
    });

    getListTechcard();
    showWait(); 
}

//получение списка БТК
function getListTechcard(message = "") {
    let grid = $("#win_btk_grid").data("kendoGrid");
    grid.setDataSource([]);
    $.ajax({
		url: "https://" + host + "/complaints/api/igestori/GetListTechcard?barcode=" + currentRecipe.RecipeChange.LocCode,
		type: "GET",
		success: function (data) {
            //console.log(data);
            if (typeof (data) == "object") {
                
                if (data.length > 0){
                    if (data[0].brand){
                        $("#win_btk_brand").data("kendoDropDownList").select(function(dataItem) {
                            return dataItem.UUID === data[0].brand.UUID;
                        });
                    }
                    if (data[0].catMenu){
                        $("#win_btk_category").data("kendoDropDownList").select(function(dataItem) {
                            return dataItem.UUID === data[0].catMenu.UUID;
                        });
                    }
                    if (data[0].createdMealTK){
                        $("#win_btk_author").data("kendoDropDownList").setDataSource([{UUID:data[0].createdMealTK.UUID, title: data[0].createdMealTK.title}]);
                        $("#win_btk_author").data("kendoDropDownList").select(function(dataItem) {
                            return dataItem.UUID === data[0].createdMealTK.UUID;
                        });
                    }else{
                        $("#win_btk_author").data("kendoDropDownList").setDataSource([]);
                    }
                    if (data[0].costMeal){
                        //$("#win_btk_cost").val(data[0].costMeal);
                    }
                    if (data[0].weightMealTK){
                        $("#win_btk_weight").val(data[0].weightMealTK);
                    }                     
                }

                //пробуем найти автора по ФИО из техкарты
                if ($("#win_btk_author").data("kendoDropDownList").dataSource.data().length == 0){
                    $.ajax({
                        url: "https://" + host + "/complaints/api/igestori/GetEmployees?name=" + currentRecipe.RecipeChange.Work,
                        global: false,
                        type: "GET",
                        success: function (data) {
                            if (typeof (data) == "object") {
                                //console.log(data);
                                data = data.map((item) => {
                                    return {
                                        title: item.title + (item.post ? " / " + item.post : ""),
                                        UUID: item.UUID
                                    }
                                })
                                $("#win_btk_author").data("kendoDropDownList").setDataSource(data);
                                if (data.length == 1){
                                    $("#win_btk_author").data("kendoDropDownList").select(0);  
                                }else{
                                    $("#win_btk_author_src").html("Автор в ТК: " + currentRecipe.RecipeChange.Work);
                                }
                            };
                        }
                    });
                }
                grid.setDataSource(data);
                hideWait(message);
            }            		    
		},
		error: function(error){
			console.log(error);
            hideWait(message + "\n" + "При получении списка БТК произошла ошибка!")
		}
	});
}

//показ калькуляции из формы БТК
function showTK(){
    ShowCalculation(currentRecipe.Recipe.LocCode, currentRecipe.Recipe.NumAkt, currentRecipe.RecipeChange.Work);
}

//Создать новую БТК
function newBTK(){

    if (!checkBTKField()){
        return;
    }

    $('<div />').kendoConfirm({                        
        content: "Вы действительно хотите создать новую БТК?",
        messages:{
            okText: "Да",
            cancel: "Нет"
        },
    }).data("kendoConfirm").open().result
    .done(function(){ 
        showWait("Формирование печатной формы...");
        exportToPDF(sendTechcard);
    });
}

//Обновить существующую БТК
function updateBTK(){

    if (!checkBTKField()){
        return;
    }

    let grid = $("#win_btk_grid").data("kendoGrid");
    let selectedRows = grid.select();
    if (selectedRows.length == 0) {
        kendoAlert("Необходимо отметить обновляемую БТК!", "Ошибка заполнения");
        return;
    }
    if (selectedRows.length > 1) {
        kendoAlert("Отмечено более одной БТК!", "Ошибка заполнения");
        return;
    }  

    $('<div />').kendoConfirm({                        
        content: "Вы действительно хотите обновить выбранную БТК?",
        messages:{
            okText: "Да",
            cancel: "Нет"
        },
    }).data("kendoConfirm").open().result
    .done(function(){ 

        if (grid.dataItem(selectedRows[0]).state == "inprogress") {
            resetBTKState = false;
            $('<div />').kendoConfirm({                        
                content: 'Статус обновляемой БТК "Актуальная", изменить её статус на "На проверке"?',
                messages:{
                    okText: "Да",
                    cancel: "Нет"
                },
            }).data("kendoConfirm").open().result
            .done(function(){
                resetBTKState = true;
                showWait("Формирование печатной формы..."); 
                exportToPDF(sendTechcard, grid.dataItem(selectedRows[0]).UUID);
            })
            .fail(function(){ 
                showWait("Формирование печатной формы..."); 
                exportToPDF(sendTechcard, grid.dataItem(selectedRows[0]).UUID);                
            });
        }else{
            showWait("Формирование печатной формы..."); 
            exportToPDF(sendTechcard, grid.dataItem(selectedRows[0]).UUID);
        }
    });
}

//проверка заполненности полей формы БТК
function checkBTKField(){    
    if ($("#win_btk_category").data("kendoDropDownList").value() == ""){
        kendoAlert("Выберите категорию!");
        return false;
    }
    if ($("#win_btk_brand").data("kendoDropDownList").value() == ""){
        kendoAlert("Выберите концепцию!");
        return false;
    }
    if ($("#win_btk_weight").val() == ""){
        kendoAlert("Укажите выход блюда по ТК!");
        return false;
    }
    if ($("#win_btk_cost").val() == ""){
        if (!confirm("Себестоимость не была рассчитана, Вы действительно хотите обновить БТК без цен?")){
            return false;
        }
    }        
    if ($("#win_btk_author").data("kendoDropDownList").dataSource.data().length > 0 && $("#win_btk_author").data("kendoDropDownList").value() == ""){
        kendoAlert("Выберите автора блюда по ТК!");
        return false;
    }    
    return true;
}

//отправка в Naumen БТК
function sendTechcard(uuid){    
    let recipe = currentRecipe.Recipe;
    let title = recipe.Name;
    let barcode = recipe.LocCode;
    let description = recipe.TechCard;
    let createdMealTK = $("#win_btk_author").data("kendoDropDownList").value();
    let catMenuUUID = $("#win_btk_category").data("kendoDropDownList").value();
    let brandUUID = $("#win_btk_brand").data("kendoDropDownList").value();
    let weightMealTK = $("#win_btk_weight").val();
    let costMeal = $("#win_btk_cost").val();

    let data = '{"File" : "' + FilePDF + '",' + 
                '"FileFree":"' + FilePDFFree + '",' + 
                '"Title":"' + title + '",' + 
                '"Description":"'+description +'",' +
                '"Barcode":' + barcode + ',' + 
                '"catMenuUUID":"' + catMenuUUID + '",' +
                '"brandUUID":"' + brandUUID + '",' +
                '"createdMealTKUUID":"' + createdMealTK + '",' +
                '"TechcartUUID":"' + (uuid ? uuid : '') + '",' +                
                '"weightMealTK":' + (weightMealTK == "" ? 0 : weightMealTK)  + ',' +
                '"ResetState":' + (resetBTKState ? 1 : 0) + ',' +
                '"costMeal":"' + costMeal + '"}';
    $.ajax({
        type: "POST",
        url: "https://" + host + "/complaints/api/igestori/sendTechcard",
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        data: data,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    }).done(function (data) {
        //console.log(data);
        getInfoBTK(currentRecipe.Index);        
        showWait("Обновление списка БТК...", true);
        getListTechcard("Данные успешно отправлены!");
    }).fail(function (error) {
        //console.log(error);
        hideWait("При отправке данных произошла ошибка!");
    });                    
}

//выгрузка в pdf
function exportToPDF(sender, param){    
    fillPrintForm(false);
    $("#btk_print_form").css("visibility","visible");

    kendo.drawing.drawDOM($("#btk_print_form"))
    .then(function (group) {
        return kendo.drawing.exportPDF(group, {
            paperSize: "auto", //"A4", //"auto",
            margin: { left: "2cm", top: "2cm", right: "2cm", bottom: "2cm" }
        });
    })
    .done(function (data) {        
        FilePDF = data;
        fillPrintForm(true);    
        kendo.drawing.drawDOM($("#btk_print_form"))
        .then(function (group) {
            return kendo.drawing.exportPDF(group, {
                paperSize: "auto",
                margin: { left: "2cm", top: "2cm", right: "2cm", bottom: "2cm" }
            });
        })
        .done(function (data) {
            $("#btk_print_form").css("visibility","hidden");
            FilePDFFree = data;        
            if (sender){
                showWait("Отправка данных...", true);
                sender(param);
            }
        });
    });
}

//заполнение полей печатной формы
function fillPrintForm(priceFree = false){    
    let recipe = currentRecipe.Recipe;
    let data_source = [];

    data_source = recipe.Rows.map(function (item) {
        return {
            Name: item.LocCode + " " + item.Name,
            Brutto: item.QuanBrutto,
            Netto : item.QuanNetto,
            Wastes: Math.round((parseFloat(item.QuanBrutto) - parseFloat(item.QuanNetto)) * 100 / item.QuanBrutto),
            Unit: item.Unit,
            Price: item.Price,
            Total: item.Total,
        };
    });
    //let totalPrice = data_source.reduce((previousValue, currentValue) => previousValue + currentValue.Total, 0).toFixed(2);
	let totalPrice = recipe.Total;
    //поля
    $("#print_calc_name").html(String(recipe.LocCode) + " - " + recipe.Name);    
    $(".show_price").css("display","none");
    if (!priceFree) {
        $(".show_price").css("display","");
        $("#print_calc_total").html(totalPrice);    
    }
    $("#print_calc_description").html(recipe.TechCard);
    $("#print_calc_dish_output").html($("#win_btk_weight").val());

    //таблица
    var grid = $("#print_grid_calculation").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#print_grid_calculation").children().remove();

    $("#print_grid_calculation").kendoGrid({
        //toolbar: ["pdf"],
        columns: 
        [
            { 
                field: "Name",
                title: "Наименование",
                width: "300px",
            },{
                field: "Unit",
                title: "Ед.изм.",
            },{
                field: "Brutto",
                title: "Брутто",
                type: "number",
                format: "{0:0.000}",
            },{
                field: "Wastes",
                title: "Отходы, %",
            },{
                field: "Netto",
                title: "Нетто",
                type: "number",
                format: "{0:0.000}",
            },{
                field: "Price",
                title: "Нормативная \nцена",
                attributes: {style: "text-align: right;"},
                type: "number",
                format: "{0:0.00}",
            },{
                field: "Total",
                title: "Сумма",
                attributes: { style: "text-align: right;"},
                type: "number",
                format: "{0:0.00}",
            }
        ],
        width: 720,
        navigatable: false,
        dataSource: {
            data: data_source,
        },        
    });

    //сокрытие колонки с ценой и стоимостью
    if (priceFree) {        
        $("#print_grid_calculation").data("kendoGrid").hideColumn(5);
        $("#print_grid_calculation").data("kendoGrid").hideColumn(6);
    }    
}

//инициализация объектов kendo 
function kengoObjectsInit(){

    notificationWidget = $("#notification").kendoNotification({
        position: {
            pinned: true,
            right: 50,
            bottom: 30,
        },
        autoHideAfter: 7000,
    }).data("kendoNotification"); 

    //окно с ожиданием выполнения 
    $("#win_waiting").kendoWindow({
        width: "400px",
        height: "200px",
        modal: true,
        resizable: false,
        title: "Обработка запроса",
        visible: false,
        sizable: true,
    });

    //окно с информацией о БТК
    $("#win_btk").kendoWindow({
            width: "90%",
            height: "90%",
            modal: true,
            resizable: false,
            title: "Отправка БТК",
            visible: false,
    });

    $("#win_btk_category").kendoDropDownList({dataTextField: "title", dataValueField: "UUID", placeholder: "выберите категорию", clearButton: false,});    
    $("#win_btk_brand").kendoDropDownList({dataTextField: "title", dataValueField: "UUID", clearButton: false,});    
    $("#win_btk_author").kendoDropDownList({dataTextField: "title", dataValueField: "UUID", clearButton: false,});    
    $("#win_btk_cost").currencyFormat();
    $("#win_btk_weight").keypress(function (e){return /^\d*\.?\d*$/i.test(e.key);});
    $("#win_btk_author").kendoDropDownList({dataTextField: "title", dataValueField: "UUID", clearButton: false,});    
    $("#win_btk_cost_recalc").kendoButton({
        click: function(e) {
            calculateCost();
        }
    });
    

    //таблица БТК
    $("#win_btk_grid").kendoGrid({
        toolbar: [
            {template: '<a class="k-button" href="\\#" onclick="return newBTK();">Создать новую БТК</a>'},
            {template: '<a class="k-button" href="\\#" onclick="return updateBTK();">Обновить существующую БТК</a>'},
            {template: '<a class="k-button" href="\\#" onclick="return showTK();">Показать ТК</a>'},
            //{template: '<a class="k-button" href="\\#" onclick="return reloadIngredients();">Загрузить цены</a>'},
        ],
        columns: 
        [
            {
                selectable: true,
                width: 40,
                attributes: {
                    "class": "checkbox-align",
                },
                headerAttributes: {
                    "class": "checkbox-align",
                }
            },{
                field: "files",
                title: "Файл",
                width: "65px",
                template: function (dataItem) {
                    return getFileLink(dataItem.files);
                },
                attributes: {style: "text-align: center;"},
            },{
                field: "number",
                title: "Номер",
                width: "100px",
            },{
                field: "creationDate",
                title: "Дата создания",
                //format: "{0:dd.MM.yyyy HH:mm}",
                //type: "date",
                width: "165px",
            },{
                field: "lastModifiedDate",
                title: "Дата изменения",
                //format: "{0:dd.MM.yyyy HH:mm}",
                //type: "date",
                width: "165px",
            },{
                field: "title",
                title: "Рабочее наименование",
            },{
                field: "state",
                title: "Статус",
                width: "150px",
                template: function (dataItem) {
                        return getStatusBTK(dataItem.state);
                    }
            },{
                field: "weightMealTK",
                title: "Выход блюда по ТК",
                width: "170px",
            },{
                field: "createdMealTK",
                title: "Автор блюда по ТК",
                template: function (dataItem) {
                    return dataItem.createdMealTK ? dataItem.createdMealTK.title: "";
                }
            },{
                field: "costMeal",
                title: "Себестоимость",
                width: "150px",
                attributes: {style: "text-align: right;"},
                type: "number",
                format: "{0:0.00}",
            }
        ],
        width: "90%",
        navigatable: false,
    });   
}

//загрузка справочников
function getDirectories(){
    //категории меню
    $.ajax({
        url: "https://" + host + "/complaints/api/igestori/GetMenuCats",
        type: "GET",
        success: function (data) {
            $("#win_btk_category").data("kendoDropDownList").setDataSource(data);
        },
        error: function(error){
        }
    });
    //концепции
    $.ajax({
        url: "https://" + host + "/complaints/api/igestori/GetBrands",
        type: "GET",
        success: function (data) {
            $("#win_btk_brand").data("kendoDropDownList").setDataSource(data);
        },
        error: function(error){
        }
    });
    //перезагрузка справочника ингредиентов (отрабатывает, если с момента прошлого обновления прошло более 4 часов)
    //отключена при переходе на сервис получения нормативных цен
    /*
    $.ajax({
        url: "https://" + host + "/complaints/api/igestori/ReloadIngredients",
        type: "GET",
        success: function (data) {
            console.log("ReloadIngredients:" + data);
        },
        error: function(error){
            console.log("ReloadIngredients error:");
            console.log(error);
        }
    });    
    */    		  
}

//перерасчет себестоимости блюда
function calculateCost(){
    
    let recipe = currentRecipe.Recipe;
    if (!recipe.Total && recipe.Total != 0) {

        GetPriceAndCalculateCost(recipe, function(){
            $("#win_btk_cost").val(recipe.Total.toFixed(2));
            $("#win_btk_cost_recalc").html("Показать расчет"); //Рассчитать
        });

    }else{
        fillPrintForm();
        $("#win_btk_print_form").kendoWindow({
            actions: ["Close"],
            width: "1060px",
            height: "90%",
            modal: true,
            resizable: false,
            title: "Печатная форма БТК (с ценами)",
            //visible: false,
            close: function(e) {
                $("#win_btk_print_form").children().remove();
            },
        });
        let printForm = $("#btk_print_form").clone();
        printForm.css("visibility", "visible");
        printForm.appendTo("#win_btk_print_form");
        $("#win_btk_print_form").data("kendoWindow").center().open();
    }
}

function GetPriceAndCalculateCost(recipe, calback) {
    console.log(recipe);
    let barcodes = recipe.Rows.map((item) => item.LocCode);
    setButtonDisabled("win_btk_cost_recalc", true);     
    $.ajax({
        //url: "https://" + host + "/complaints/api/igestori/GetIngredientsPrice?barcodes=" + barcodes.toString(),
        url: "https://" + host + "/complaints/api/igestori/GetIngredientsPriceNew?barcodes=" + barcodes.toString() + "," + recipe.LocCode, 
        type: "GET",
        success: function (data) {
            console.log("GetPriceAndCalculateCost");
            console.log(data);
            if (typeof (data) == "object") {

                let noPrice = "";
                let lastUpdate = data.LastUpdate;
                //console.log(lastUpdate);
                let total = 0;
                recipe.Rows.forEach(function (item){
                    //let ingredient = data.Ingredients.find((i) => i.BarCode == item.LocCode);                        
                    //item.Price = ingredient? ingredient.PriceCurrent: 0;
                    let ingredient = data[item.LocCode];                        
                    item.Price = ingredient ? ingredient.price : 0;
                    item.Total = Math.round(item.Price * item.QuanBrutto * 100) / 100;
                    total += item.Total;

                    //проверка на отсутствие цены
                    if (item.Price == 0){
                        noPrice += "<br>" + item.LocCode + " " + item.Name + " (" + (ingredient ? ingredient.error : "") + ")";  
                    }
                });
                total = Math.round(total * 100) / 100;
                recipe.Total = total;
                //console.log(recipe);

                setButtonDisabled("win_btk_cost_recalc", false);
                if(noPrice != ""){
                    //обнуляем себестоимость, если есть ингредиенты без цены
                    recipe.Total = 0;
                    kendoAlert("Не найдена себестоимость следующих ингредиентов: <b>" + noPrice + "</b><br><br>Обратитесь в департамент логистики!");
                }

                calback();
            }
        },
        error: function(error){            
            console.log(error);
            setButtonDisabled("win_btk_cost_recalc", false);
        }
    });
}
//функция показа окна ожидания загрузки
function showWait(message = "", append = false) {
    $("#win_waiting_info").html((append ? $("#win_waiting_info").val() + "<br>": "") + message);
    $("#win_waiting").data("kendoWindow").center().open();
}

//функция сокрытия окна ожидания загрузки
function hideWait(message = "") {
    $("#win_waiting").data("kendoWindow").close();
    if(message != "")
        kendoAlert(message);
}

//
function getWaitImage(){
    return '<img style="width:50%;" src="wait.gif" />';
}

//
function kendoAlert(message, title = "Сообщение"){
    $("<div>").kendoAlert({
        title: title,
        content: message,
        messages:{
          okText: "OK"
        }
      }).data("kendoAlert").open();
}

//получение статуса БТК
function getStatusBTK(state){
    switch (state){
        case "inprogress":
            return "Актуальная";
        case "registered":
            return "На проверке";
        case "resolved":
            return "Отменена";
        }
    return state;
}

function getStatusBTKColor(state){
    switch (state){
        case "inprogress":
            return "green";
        case "registered":
            return "Orange";//"DarkOrange";
        case "resolved":
            return "black";
        }
    return "grey";
}

//
function getFileLink(files){
    //console.log(files);
    if (files && files.length > 0){                
        //return '<a style="color:red;" href="https://' + host + '/complaints/api/igestori/getfile?uuid=' + files[files.length == 2 ? 1 : 0] + '" target="_blank"><span style="color:red;" class="k-icon k-i-file-pdf"></span></a>'; 
        if (files.length == 1) {
            return '<a style="color:red;" href="https://' + host + '/complaints/api/igestori/getfile?uuid=' + files[0] + '" target="_blank"><span style="color:red;" class="k-icon k-i-file-pdf"></span></a>'; 
        }else{
            return '<a style="color:red;" href="https://' + host + '/complaints/api/igestori/getfile?uuid=' + files[0] + '" target="_blank" title="с ценами"><span style="color:red;" class="k-icon k-i-file-pdf"></span></a> ' + 
                   '<a style="color:red;" href="https://' + host + '/complaints/api/igestori/getfile?uuid=' + files[1] + '" target="_blank" title="Без цен"><span style="color:red;" class="k-icon k-i-file-pdf"></span></a>'; 
        }
    }
    return "-";
}

//
function showDishCost(){
    let recipe = currentRecipe.Recipe;
    GetPriceAndCalculateCost(recipe, function(){
		kendoAlert("Расчетная себестоимость блюда/полуфабриката по нормативным ценам: <b>" + recipe.Total + "</b> руб.", title = "Себестоимость");
    });    
}
//получение всплывающей подсказки с информацией о БТК
function getBTKTitle(data){
    return "номер: " + data.number + 
    "\nсоздана: " + data.creationDate + 
    "\nизменена: " + data.lastModifiedDate +
    "\nстатус: " + getStatusBTK(data.state) +
    (data.weightMealTK ? "\nвыход по ТК: " + data.weightMealTK : "") + 
    (data.costMeal ? "\nсебестоимость по ТК: " + data.costMeal : "") +  
    (data.createdMealTK ? "\nавтор блюда по ТК: " + data.createdMealTK.title : "") + 
    "\n\nНажмите для просмотра БТК";
}

function getNoun(number, one, two, five) {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
      return five;
    }
    n %= 10;
    if (n === 1) {
      return one;
    }
    if (n >= 2 && n <= 4) {
      return two;
    }
    return five;
}

// mini jQuery plugin that formats to two decimal places
(function($) {
    $.fn.currencyFormat = function() {
        this.each( function( i ) {
            $(this).change( function( e ){
                if( isNaN( parseFloat( this.value ) ) ) return;
                this.value = parseFloat(this.value).toFixed(2);
            });
        });
        return this; //for chaining
    }
})(jQuery);

function isBTKUser() {
    return usersBTK.includes(RoleUser.Login);
    //return RoleUser.Login == "manager" || RoleUser.Login == "r.m.valladares@coffeemania.ru" || RoleUser.Login == "t.andreeva@coffeemania.ru" || RoleUser.Login == "n.yangildina@coffeemania.ru";
}

function setButtonDisabled(id, value){
    $("#" + id).attr('disabled', value);
}