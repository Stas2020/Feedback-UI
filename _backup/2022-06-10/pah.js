
var dep_list;


var refSymDone = "✅";
var refSymNotDone = "❌";
var refSymNoData = "❔";

var userCanChangeData = false;
var userCanChangeOnlyStaffTableData = false;
var userCanChangeOnlyDecret = false;
var userCanChangeOnlyVacations = false;


$(document).ready(function () {

    /*
    $.ajax({
        url: "https://" + host + "/complaints/api/info/getdepartments",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof(data) == "object") {

                dep_list = data;

            }
        }
    });
*/

});


function getdepartments()
{
    $.ajax({
        url: "https://" + host + "/complaints/api/info/getdepartments",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof(data) == "object") {

                dep_list = data;

            }
        }
    });
}


function GetNameDepartmen(dep_id)
{
    var departmen_name;
    dep_list.forEach(function (item_) {

        if(item_.DepId == Number(dep_id))
        {
            departmen_name = item_.DepName;
        }
    });

    return departmen_name;
}

function RefreshSanPin() {
    var filtersGet = "";
    if ($("#sanpin_use_filters").is(":checked")) {
        var SD = $("#datepickerstart_sanpin").val().split('/');
        var ED = $("#datepickerend_sanpin").val().split('/');
        var FStartDate = SD[2] + SD[1] + SD[0];
        var FEndDate = ED[2] + ED[1] + ED[0];

        filtersGet = "?Filters=true&FStartDate=" + FStartDate + "&FEndDate=" + FEndDate

        var deps = $("#sanpin_deps").data("kendoComboBox").value()
        if (deps != "")
            filtersGet += "&FDeps=" + String(deps)

        var chklists = $("#sanpin_checklists").data("kendoComboBox").value()
        if (chklists != "")
            filtersGet += "&FCheckLists=" + String(chklists)
        else
            filtersGet += "&FCheckLists=1;2;3;36"
    }

    $(".tr_row").remove();


    $("#grid_sanpin2").css("display", "none");
    $("#grid_sanpin2").parent().append('<img id="wait_sanPin" style="width: 10%; margin-top:50px;margin-left:45%; margin-right:45%" src="https://s2010/feedback/wait5.gif" />');




    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetCheckListReportStats" + filtersGet,
        global: false,
        type: "GET",
        success: function (data) {

            if (typeof (data) == "object") {

                $("#wait_sanPin").remove();
                $("#grid_sanpin2").css("display", "");
				//console.log(data);
                ReportSanPin2(data);
            }
            else {
                onExit();
            }
        },
        error: function (jqXHR, exception) {
            $("#wait_sanPin").remove();
            $("#grid_sanpin2").css("display", "block");

            getErrorMessage(jqXHR, exception);
        }
    });
}
function ReportSanPin(data) {

	

    var iMax = 0;
    data.forEach(function (item) {
        item.CheckListStats.forEach(function (it, idx) {
            it.Stats.forEach(function (items, idx) {
                if (idx > iMax) iMax = idx
            });
        });
    });
	
    iMax+=10;
    var cellsWidth = iMax * 80 + 4 + 2 + 10;//10 на всякий
    var divWidth = $(".table_checklist").width();
    if (cellsWidth > divWidth) {
        $('.table_checklist').css('width', String(cellsWidth) + 'px!important');
        $('#tbody_data').css('width', String(cellsWidth) + 'px!important');
        $(".table_checklist").width(cellsWidth);
        $("tbody_data").width(cellsWidth);
    }

    //var divWidth1 = $('.table_checklist').css('width');
    //var divWidth2 = $('#tbody_data').css('width');
    //var divWidth3 = $(".table_checklist").width();
    //var divWidth4 = $("tbody_data").width();

    data.forEach(function (item) {

        var row = $('<tr class="tr_row"></tr>');
        var rowspan = item.CheckListStats.length;
        var cell = $('<th class="division_tab" rowspan=' + rowspan + '></th>').html(item.DepName);
        row.append(cell);
        $("#thead_tab").append(row);



        item.CheckListStats.forEach(function (it, idx) {

            if (it.Summary != null && it.Summary.MedianAsc != null) {
                if (idx > 0) {
                    var row_ = $('<tr class="tr_row"></tr>');
                    var cell = $('<th class="checklist"></th>').html(it.CheckListName + '<br> Медиана: <span style="color:lightblue">' + kendo.toString(it.Summary.MedianAsc, "##") + '</span><br> Сред.знач.: ' + kendo.toString(it.Summary.Avg, "##"));
                    row_.append(cell);
                    $("#thead_tab").append(row_);
                }
                else {
                    var cell = $('<th class="checklist"></th>').html(it.CheckListName + '<br> Медиана: <span style="color:lightblue">' + kendo.toString(it.Summary.MedianAsc, "##") + '</span><br> Сред.знач: ' + kendo.toString(it.Summary.Avg, "##"));
                    row.append(cell);
                }
            }
            else {
                it.LastStat.StatCompleted;
                if (idx > 0) {
                    var row_ = $('<tr class="tr_row"></tr>');
                    var cell = $('<th class="checklist"></th>').html(it.CheckListName + '<br>' + it.LastStat.StatDate.substring(0, 10) + ' <br>' + it.LastStat.StatRatio);
                    row_.append(cell);
                    $("#thead_tab").append(row_);
                }
                else {
                    var cell = $('<th class="checklist"></th>').html(it.CheckListName + '<br> ' + it.LastStat.StatDate.substring(0, 10) + '<br> ' + it.LastStat.StatRatio);
                    row.append(cell);
                }
            }

            var row__ = $('<tr class="tr_row"></tr>');
            var cell__ = $('<td></td>');
            row__.append(cell__);
            it.Stats.forEach(function (items) {
                var img = "";
                if (items.HasPhoto)
                    img = '<img src="https://s2010/feedback/img/IconPhoto.png" style="margin-left:10px;margin-bottom:2px;">'
                if (items.StatCompleted == true) {
                    items.StatDate
                    var div = $('<div class="cell_div StatCompleted" style="display: inline-block; cursor:pointer"></div>').html(items.StatDate.substring(0, 10) + ' <br>' + items.StatRatio + img);
                    div.click({ data_check_list_id: it.CheckListId, data_dep_id: item.DepId, data_stat_date: items.StatDate, doc_num: items.StatDocNum }, function (eventObject) {

                        ShowDetail(eventObject.data.data_check_list_id, eventObject.data.data_dep_id, eventObject.data.data_stat_date, eventObject.data.doc_num);
                    });
                    if (items.StatDocNum != null)
                        div.attr("title", items.StatDocNum) 
                }
                else {
                    var div = $('<div class="cell_div " style="display: inline-block"></div>').html(items.StatDate.substring(0, 10) + ' <br>' + items.StatRatio + img);
                }
                cell__.append(div);
                items.StatCompleted;
            });
            $("#tbody_data").append(row__);
        });
    });
}


function GetDataPahar() {

    var grid = $("#grid_pahar").data("kendoGrid");
	    if(grid)
	    {
	        grid.destroy();
	    }
	    $("#grid_pahar").remove();
	grid = $("#grid_pahar").data("kendoGrid");

    var _today = new Date();
    var _priorDate = new Date(new Date().setDate(_today.getDate()-30));

    $("#datepickerstart_pah").kendoDatePicker({format: "dd/MM/yyyy"});
    $("#datepickerend_pah").kendoDatePicker({format: "dd/MM/yyyy"});

    $("#datepickerstart_pah").data("kendoDatePicker").value(_priorDate);
    $("#datepickerend_pah").data("kendoDatePicker").value(_today);


    var SD = $("#datepickerstart_pah").val().split('/');
    var ED = $("#datepickerend_pah").val().split('/');


    var FStartDate = SD[2]+SD[1]+SD[0];
    var FEndDate = ED[2]+ED[1]+ED[0];

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetIndicatorTable?FStartDate="+FStartDate+"&FEndDate="+FEndDate,
        global: false,
        type: "GET",
        success: function (data) {
		//console.log(data);
            if (typeof(data) == "object") {
                PrepareData(data)
            };
        }
    })
}
function ExecutePah()
{
    var grid = $("#grid_pahar").data("kendoGrid");
	    if(grid)
	    {
	        grid.destroy();
	    }
	    $("#grid_pahar").remove();
	grid = $("#grid_pahar").data("kendoGrid");

    var SD = $("#datepickerstart_pah").val().split('/');
    var ED = $("#datepickerend_pah").val().split('/');


    var FStartDate = SD[2]+SD[1]+SD[0];
    var FEndDate = ED[2]+ED[1]+ED[0];

    var refResults = $("#pah_ref_results").is(":checked") ?"&RefResults=true":"";
    var refValues = $("#pah_ref_values").is(":checked") ?"&RefValues=true":"";

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetIndicatorTable?FStartDate=" + FStartDate + "&FEndDate=" + FEndDate + refResults + refValues,
        global: false,
        type: "GET",
        success: function (data) {
		console.log(data);
            if (typeof(data) == "object") {
                PrepareData(data)
            };
        }
    })


}

function SanpinFiltersPanelVisible() {

    var nowVisible = $("#sanpin_use_filters").is(":checked");

    var controlsData = $("#datepickerstart_sanpin").data("kendoDatePicker");

    if (nowVisible && controlsData == null) {
        var _today = new Date();
        var _priorDate = new Date(new Date().setDate(_today.getDate() - 30 * 6));

        $("#datepickerstart_sanpin").kendoDatePicker({ format: "dd/MM/yyyy" });
        $("#datepickerend_sanpin").kendoDatePicker({ format: "dd/MM/yyyy" });

        $("#datepickerstart_sanpin").data("kendoDatePicker").value(_priorDate);
        $("#datepickerend_sanpin").data("kendoDatePicker").value(_today);

        $("#sanpin_deps").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });
        $("#sanpin_checklists").kendoComboBox({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: []
        });

        var deps = dep_list.filter(_dep => _dep.isActive);
        deps.sort(function (a, b) { return a.DepNum - b.DepNum; });
        deps = deps.map(function (_dep) { return { value: _dep.DepId, text: String(_dep.DepNum) + " " + _dep.DepName }; });
        deps.unshift({ value: "ALL", text: "Все подразделения" });
        $("#sanpin_deps").data("kendoComboBox").setDataSource(deps);

        $("#sanpin_checklists").data("kendoComboBox").setDataSource([
            { value: "1;2;3;36", text: "Все отчеты" },
            { value: "1;2;3", text: "Все СанПин" },
            { value: "1", text: "СанПин Кухня" },
            { value: "2", text: "СанПин Чистота" },
            { value: "3", text: "СанПин Стойка" },
            { value: "36", text: "Бракераж" },
        ]);
    }

    $("#sanpin_filters").css("display", (nowVisible ? "inline-block" : "none")); 
}

function RefsPah() {
    if (RefEqualsTypes == null) {
        $.ajax({
            url: "https://" + host + "/complaints/api/info/GetEqualTypes",
            global: false,
            type: "GET",
            success: function (data) {
                if (typeof (data) == "object") {
                    RefEqualsTypes = [];
                    data.forEach(function (item) {
                        var ddt = new Object();
                        ddt.Id = item.Id;
                        ddt.Note = item.Note;
                        RefEqualsTypes.push(ddt);

                    });
                    RefsPahReportsTypes();
                };
            }
        })
    }
    else
        RefsPahReportsTypes();
}
function RefsPahReportsTypes() {
    if (ReportTypes == null) {
        $.ajax({
            url: "https://" + host + "/complaints/api/info/GetReportsTypes",
            global: false,
            type: "GET",
            success: function (data) {
                if (typeof (data) == "object") {
                    ReportTypes = [];
                    data.forEach(function (item) {
                        var ddt = new Object();
                        ddt.Id = item.Id;
                        ddt.Caption = item.Caption;
                        ddt.Enable = item.Enable;
                        ddt.Format = item.Format;
                        ReportTypes.push(ddt);

                    });
                    RefsPahCheckLists();
                };
            }
        })
    }
    else
        RefsPahCheckLists();
}
function RefsPahCheckLists() {
    if (CheckLists == null) {
        $.ajax({
            url: "https://" + host + "/complaints/api/checklist/GetCheckListsCollection",
            global: false,
            type: "GET",
            success: function (data) {
                if (typeof (data) == "object") {
                    CheckLists = [];
                    data.forEach(function (item) {
                        var ddt = new Object();
                        ddt.CheckListId = item.CheckListId;
                        ddt.CheckListActive = item.CheckListActive;
                        ddt.CheckListName = item.CheckListName;
                        CheckLists.push(ddt);

                    });
                    RefsShowTable();
                };
            }
        })
    }
    else
        RefsShowTable();
}

function RefsShowTable() {
    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetReferenceValues",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {

                var columns = [];
                var dataSource = [];
                //var columnValues = [];

                data.forEach(function (item) {
                    var columnName = "";

                    if (item.ReportTypeID != null) 
                        columnName = "Rep_" + String(item.ReportTypeID);
                    if (item.CheckListReportId != null) 
                        columnName =  "Chk_" + String(item.CheckListReportId);
                    if (item.TestWebAPIReportName != null) 
                        columnName = "API_" + String(item.TestWebAPIReportName);

                    var column = columns.find(col => col.field == columnName);
                    if (column == null) {
                        var columnTitle = "";

                        if (item.ReportTypeID != null)
                            columnTitle = ReportTypes.find(rep => rep.Id == item.ReportTypeID).Caption; 
                        if (item.CheckListReportId != null)
                            columnTitle = CheckListName.find(chk => chk.CheckListId == item.CheckListReportId).CheckLists;
                        if (item.TestWebAPIReportName != null)
                            columnTitle = item.TestWebAPIReportName;
                        column=
                        {
                            field: columnName,
                            title: columnTitle,
                            width: "115px",
                            encoded: false,
                            headerAttributes : { style: "white-space: normal; vertical-align: top;" },                        
                        }
                        columns.push(column);
                    }


                    var place = "Все подр.";
                    if (item.Place != null) {
                        if (item.Place == "Город")
                            place = item.Place;
                        else
                            place = "Аэро";
                    }
                    if (item.DepId != null) {
                        var nowDep = DepartmentList.find(dep => Number(dep.value) == Number(item.DepId));
                        if (nowDep != null)
                            place = nowDep.text;
                        else {
                            place = "НЕ АКТИВНО";
                        }
                    }

                    var itemText = place;

                    var dateMonth = "";
                    if (item.MonthDate != null) {
                        var date = new Date(item.MonthDate);
                        var month = date.getMonth() + 1;
                        dateMonth = "Месяц: <b>" + (month < 10 ? '0' + month : month) + "." + String(date.getFullYear())+"</b>";
                        itemText += "</br>" + dateMonth;
                    }
		    else
		    {
			itemText += "</br>" + "<i>Базовое знач.</i>";	
	  	    }

                    var value = "не опред.";
                    if (item.Value != null) {
                        value = RefEqualsTypes.find(eq => eq.Id == item.EqualTypeId).Note + " " + new Intl.NumberFormat('ru-RU', { /*minimumFractionDigits: 0, maximumFractionDigits: 5, */maximumSignificantDigits: 5 }).format(item.Value);
                    }
                    value = "Знач.: " + value
                    itemText += "</br>" + value;

                    var prior = "Приоритет: " + String(item.Prior);
                    itemText += "</br>" + prior;


                    var put = false;
                    var i = 0;
                    while (!put && i < dataSource.length) {
                        if (dataSource[i][columnName] == null) {
                            dataSource[i][columnName] = itemText;
                            put = true;
                        }
                        i++;
                    }
                    if (!put)
                        dataSource.push({ [columnName]: itemText });
                });


                $("#box_pahar_ref").kendoGrid({
                    width: "100%",
                    height: "100%",//"590px",
                    sortable: true,
                    dataSource: dataSource,
                    mobile: true,
                    columns: columns
                });                

                $("#window_pah_ref").data("kendoWindow").center().open();
            };
        }
    })
}
function GetFormat(val)
{
    var result;
    if(val == "C")
    {
        result = "{0: 0.00 ₽}";
    }
    else
    {
         result = "{0:"+val+"}";
    }


    return result;
}

function PrepareData(data)
{
    var data_source = [];

    // dep_list.forEach(function (item_) {
    //     var obj = new Object();
    //     obj["field0"] = item_.DepName;
    //     data_source.push(obj);
    // });

    var ListColumn = [];
    var columns = new Object();
    columns.field = "field0";
    columns.title = "Ресторан";
    columns.width = "200px";
    columns.headerAttributes = { style: "vertical-align: top;"};// middle
   // columns.headerAttributes = {class: "table-header-cell_"};
    ListColumn.push(columns);


    data.forEach(function (item, idx) {

        var columns = new Object();
        var col = idx + 1;
        var caption = item.Caption;
        var colName = "field" + col;
        columns.field = colName;
        columns.title = item.Caption;
        columns.format = GetFormat(item.FormatString);
        columns.headerAttributes = { style: "white-space: normal; vertical-align: top;" };// middle
        // Новый вариант форматирования
        columns.sortable = {
            compare:
                function (a, b, desc)
                {                
                    return (a[colName] == null ? 0 : (a[colName].Value != null ? a[colName].Value : a[colName]))
                         - (b[colName] == null ? 0 : (b[colName].Value != null ? b[colName].Value : b[colName]));
                }
        }
        columns.template = function (item) {
            var value = "";
            if (item["field" + col] != null) {
                value = item["field" + col].FormatedValue; 
                if (caption == "СанПин АБС")
                    value = "<a style='cursor:pointer;text-decoration: underline;' onclick='getSanPinDetails(" + String(item.fieldDepId) + ")'>" + value + "</a>"
                if (item["field" + col].ReferenceResult != null) {
                    switch (item["field" + col].ReferenceResult) {
                        case 1:
                            value = refSymDone + " " + value;
                            break;
                        case 2:
                            value = refSymNotDone + " " + value;
                            break;
                        case 3:
                            value = refSymNoData + " " + value;
                            break;
                        default:
                    }
                    if (item["field" + col].ReferenceFormatedValue != null)
                        value += " [" + item["field" + col].ReferenceFormatedValue.replace(" ", "") + "]";
                }
            }
            return value;
        }
        // END Новый вариант форматирования

        //columns.headerAttributes = {class: "table-header-cell_"};
        ListColumn.push(columns);


        Object.keys(item.Values).map(function(key, index) {


            // Новый вариант форматирования
            var value = new Object();
            value.Value = item.Values[key];
            value.FormatedValue = item.FormatedValues[key];
            var dep_name = GetNameDepartmen(key);
            if (item.ReferenceResult[key] != null) value.ReferenceResult = item.ReferenceResult[key];
            if (item.ReferenceFormatedValues[key] != null) value.ReferenceFormatedValue = item.ReferenceFormatedValues[key];
            // END Новый вариант форматирования

            // Старый вариант форматирования
            /*var value;
            var dep_name = GetNameDepartmen(key);
            if (item.ReferenceResult[key] != null) {
                value = item.FormatedValues[key];
                switch (item.ReferenceResult[key]) {
                    case 1:
                        value = refSymDone+" " + value;
                        break;
                    case 2:
                        value = refSymNotDone+" " + value;
                        break;
                    case 3:
                        value = refSymNoData+" " + value;
                        break;
                    default:
                }
                if (item.ReferenceFormatedValues[key] != null)
                    value += " [" + item.ReferenceFormatedValues[key].replace(" ", "") + "]";
            }
            else
                value = item.Values[key];*/
            // END Старый вариант форматирования

            var hasDep = false;
            data_source.forEach(function (value1) {
                if (value1.field0 == dep_name) {
                    value1["field" + col] = value;
                    hasDep = true;
                }
            });
            if (!hasDep) {
                var obj = new Object();
                obj["fieldDepId"] = key;
                obj["field0"] = dep_name;
                obj["field" + col] = value;
                data_source.push(obj);
            }

        });
    });

    function excelexport(e) {
        var colFormats = [];
        $("#grid_pahar").data("kendoGrid").columns.forEach(_col => {
            try {
                    if (_col.format != null) colFormats[_col.title] = _col.format.split(":")[1].replace("}","");
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

        var data = $("#grid_pahar").data("kendoGrid").dataSource;

        for (var i = 1; i < sheet.rows.length; i++) {
            var row = sheet.rows[i];

            var item = null;
            data.data().forEach(function (itm) {
                if (itm.field0 == row.cells[0].value)
                    item = itm;
            });
            if (item != null)
                for (var j = 1; j < row.cells.length; j++) {
                    var cell = row.cells[j];

                    var value = "";
                    if (item["field" + String(j)] != null) {
                        value = item["field" + String(j)].FormatedValue;
                        if (item["field" + String(j)].ReferenceFormatedValue != null)
                            value = value + " [" + item["field" + String(j)].ReferenceFormatedValue + "]"
                        if (item["field" + String(j)].ReferenceResult == 1) cell.background = "#CCFFCC";
                        if (item["field" + String(j)].ReferenceResult == 2) cell.background = "#FFCCCC";
                        if (item["field" + String(j)].ReferenceResult == 3) cell.background = "#F1F1F1";
                    }
                    cell.value = value;
                }

        }



        /*for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
            var row = sheet.rows[rowIndex];
            for (var cellIndex = 1; cellIndex < row.cells.length; cellIndex++) {
                var cell = row.cells[cellIndex];
                if (row.type === "data") {
                    if (colFormats[sheet.rows[0].cells[cellIndex].value] != null) {
                       // Старый вариант форматирования
                        cell.format = colFormats[sheet.rows[0].cells[cellIndex].value];
                        if (String(cell.value).indexOf(refSymDone) != -1) {
                            cell.background = "#CCFFCC";
                            cell.value = String(cell.value).replace(refSymDone + " ", "");
                        }
                        if (String(cell.value).indexOf(refSymNotDone) != -1) {
                            cell.background = "#FFCCCC";
                            cell.value = String(cell.value).replace(refSymNotDone + " ", "");
                        }
                        if (String(cell.value).indexOf(refSymNoData) != -1) {
                            //cell.background = "#F1F1F1";
                            cell.value = String(cell.value).replace(refSymNoData + " ", "");
                        }
                         //cell.NumberFormat = colFormats[sheet.rows[0].cells[cellIndex].value]; 
                        // END Старый вариант форматирования
                    }
                }
            }
        }*/
    }

    $("#box_pahar").append("<div id='grid_pahar'></div>");
    $("#grid_pahar").kendoGrid({
        toolbar: ["excel"],
        excelExport: excelexport,
        excel: {
            allPages: true,
            fileName: "plowman.xlsx"
        },
        columns: ListColumn,
        sortable: true,
        height: 600,
        resizable: true,
        navigatable: false,
        dataSource: data_source,
	dataBound: function() {
	    $('#grid_pahar .k-grid-content').height("100%");
}
    });

    $("#grid_pahar").data("kendoGrid").dataSource.sort({field: "field0", dir: "asc"});
    $("#grid_pahar").data("kendoGrid").dataSource.read();
}


function getSanPinDetails(depId) {
    var marker = "0";
    try {


        var grid = $("#grid_sanpin_details").data("kendoGrid");
        if (grid) {
            grid.destroy();
        }
        $("#grid_sanpin_details").remove();

        marker = "grid_remove"

        var SD = $("#datepickerstart_pah").val().split('/');
        var ED = $("#datepickerend_pah").val().split('/');

        var FStartDate = SD[2] + SD[1] + SD[0];
        var FEndDate = ED[2] + ED[1] + ED[0];

        var FStartDateStr = SD[0] + "." + SD[1] + "." + SD[2];
        var FEndDateStr = ED[0] + "." + ED[1] + "." + ED[2];

        marker = "dates_prepared"

        $.ajax({
            url: "https://" + host + "/complaints/api/info/GetSanPinDetails?FStartDate=" + FStartDate + "&FEndDate=" + FEndDate + "&DepId=" + String(depId),
            global: false,
            type: "GET",
            success: function (data) {
                if (typeof (data) == "object") {

                    marker = "data is object"

                    var data_source = [];

                    var allResult = 0;
                    var allCnt = 0;
                    data.forEach(function (item) {
                        var obj = new Object()
                        obj.Date = kendo.parseDate(item.Date, 'yyyy-MM-ddTHH:mm:ss')

                        marker = "dataSource date Ok"
                        obj.CheckListId = item.CheckListId
                        obj.SanPin = "";
                        var check = RoleUser.CheckLists.filter(_ch => _ch.CheckListId == item.CheckListId)
                        if (check.length > 0) obj.SanPin = check[0].CheckListName

                        marker = "dataSource checkList Ok"
                        obj.CntWithNA = item.CntWithNA
                        obj.Cnt = item.Cnt
                        obj.CntOk = item.CntOk
                        obj.Weight = 100 / obj.Cnt
                        obj.Result = obj.Weight * obj.CntOk
                        obj.AllWeight = 100

                        allResult += obj.Result
                        allCnt += 100

                        marker = "dataSource numbers Ok"
                        data_source.push(obj)
                        marker = "dataSource push Ok"
                    })
                    data_source.push({ SanPin: "Итого", Result: allResult, AllWeight: allCnt })

                    marker = "dataSource prepared"

                    $("#box_sanpin_details").append("<div id='grid_sanpin_details'></div>");
                    $("#grid_sanpin_details").kendoGrid({
                        toolbar: ["excel"],
                        excel: {
                            allPages: true,
                            fileName: "sanpin.xlsx"
                        },
                        columns: [{
                            field: "Date",
                            title: "Дата",
                            width: "80px",
                            template: function (item) {
                                try {
                                    var res = item.Date != null ? kendo.toString(item.Date, 'dd.MM.yyyy') : ""
                                }
                                catch (e) { alert("Error!   Pos: DateColumn   Msg: " + e);}
                                return res;
                            }
                            //template: function (item) { return item.Date != null ? kendo.toString(item.Date, 'dd.MM.yyyy') : "" }
                        }, {
                            field: "SanPin",
                            title: "СанПин",
                            width: "160px",
                                template: function (item) {
                                    try {
                                    var res = item.Date != null
                                        ? "<a style='cursor:pointer;text-decoration: underline;' onclick='ShowDetail(" + String(item.CheckListId) + "," + String(depId) + ",\x22" + String(item.Date) + "\x22)'>" + item.SanPin + "</a>"
                                            : ""
                                    }
                                    catch (e) { alert("Error!   Pos: SanPinColumn   Msg: " + e); }
                                    return res
                                },
                                //template: function (item) {
                                //return item.Date != null
                                //    ? "<a style='cursor:pointer;text-decoration: underline;' onclick='ShowDetail(" + String(item.CheckListId) + "," + String(depId) + ",\x22" + String(item.Date) + "\x22)'>" + item.SanPin + "</a>"
                                //    : ""
                                //}
                        }, {
                            field: "CntWithNA",
                            title: "C N/A",
                                width: "80px",
                            template: function (item) {
                                try {
                                    var res = item.Date != null ? "<span style='color:lightgray'>" + String(item.CntWithNA) + "</span>" : ""
                                }
                                catch (e) { alert("Error!   Pos: CntWithNAColumn   Msg: " + e); }
                                return res
                            },
                            //template: function (item) { return item.Date != null ? "<span style='color:lightgray'>" + String(item.CntWithNA) + "</span>" : "" }
                        }, {
                            field: "Cnt",
                            title: "Без N/A",
                            width: "80px"
                        }, {
                            field: "CntOk",
                            title: "Кол-во +",
                            width: "80px"
                        }, {
                            field: "Formula",
                            title: "Доля",
                                width: "80px",
                                template: function (item) {
                                    try {
                                        var res = item.Date != null ? String(item.CntOk) + " / " + String(item.Cnt) : ""
                                    }
                                    catch (e) { alert("Error!   Pos: FormulaColumn   Msg: " + e); }
                                    return res
                                },
                            //template: function (item) { return item.Date != null ? String(item.CntOk) + " / " + String(item.Cnt) : "" }
                        }, {
                            field: "Weight",
                            title: "Вес вопроса",
                                width: "80px",
                                template: function (item) {
                                    try {
                                        var res = item.Date != null ? kendo.toString(item.Weight, '###.##') : "<b>Итого</b>"
                                    }
                                    catch (e) { alert("Error!   Pos: WeightColumn   Msg: " + e); }
                                    return res
                                },
                            //template: function (item) { return item.Date != null ? kendo.toString(item.Weight, '###.##') : "<b>Итого</b>" }
                        }, {
                            field: "Result",
                            title: "Результат",
                                width: "160px",
                                template: function (item) {
                                    try {
                                        var res = item.Date != null ? kendo.toString(item.Result, '###.##') : (kendo.toString(item.Result, '###.##') + " / " + String(item.AllWeight) + " = <b>" + kendo.toString((item.Result / item.AllWeight) * 100, '###.##') + "</b>")
                                    }
                                    catch (e) { alert("Error!   Pos: ResultColumn   Msg: " + e); }
                                    return res
                                },
                            //template: function (item) { return item.Date != null ? kendo.toString(item.Result, '###.##') : (kendo.toString(item.Result, '###.##') + " / " + String(item.AllWeight) + " = <b>" + kendo.toString((item.Result / item.AllWeight) * 100, '###.##') + "</b>") }
                        }],
                        //sortable: true,
                        height: 570,
                        resizable: true,
                        navigatable: false,
                        dataSource: data_source
                    });

                    marker = "grid created"
                    //$("#grid_pahar").data("kendoGrid").dataSource.sort({ field: "field0", dir: "asc" });
                    $("#grid_sanpin_details").data("kendoGrid").dataSource.read();

                    marker = "grid dataSource readed"

                    var DepName = GetNameDepartmen(depId)

                    marker = "window depName got"

                    $("#window_sanpin_details").data("kendoWindow").title("СанПин    " + DepName + "   " + FStartDateStr + " / " + FEndDateStr);
                    marker = "window title setted"
                    $("#window_sanpin_details").data("kendoWindow").center().open();
                    marker = "window opened"
                }
                else {
                    alert("Error!\r\nData type is" + String((typeof (data))));
                }
            },
            error: function (data) {
                alert("Error!\r\nServer error");
            }
        });
    }
    catch (e) {
        alert("Error!   Pos: "+marker+"   Msg: " + e);
    }
}

function BarcodSelectNaumen() {
    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetBarcodesFromNaumen",
        global: false,
        type: "GET",
        success: function (data) {
            var tttt = typeof (data);
            if (typeof (data) == "object") {
                var grid = $("#grid_naumen_cat").data("kendoGrid");
                if (grid) {
                    grid.destroy();
                }
                $("#grid_naumen_cat").remove();

                var grid = $("#grid_naumen_dishes").data("kendoGrid");
                if (grid) {
                    grid.destroy();
                }
                $("#grid_naumen_dishes").remove();

                var barWidth = "100px";
                var isMobile = ($(window).width() < 1000 || $(window).height() < 600) 
                if (isMobile) {
                    //$("#naumen_tables").width("100%");
                    //$("#naumen_tables").css("width", "100%");
                    $("#box_naumen_cat").css("width", "25%");
                    $("#box_naumen_dishes").css("width", "70%"); 
                    $("#box_naumen_dishes").css("margin-left", "3px");
                    $("#box_naumen_cat").css("height", "100%");
                    $("#box_naumen_dishes").css("height", "100%"); 
                    $("#naumen_tables").css("height", "93%");
                    $("#naumen_tables").width("93%");
                    $("#naumen_buttons").css("height", "7%");
                    barWidth = "70px"
                }



                $("#box_naumen_cat").append("<div id='grid_naumen_cat'></div>");
                $("#grid_naumen_cat").kendoGrid({
                    columns: [{ field: "Name", title: "Категория", width: "100px" }],
                    selectable: "row",
                    height: isMobile ? "100%" : 630,
                    resizable: false,
                    dataSource: data.Cats,
                    dataBound: function () {
                        $('#grid_naumen_cat .k-grid-content').height("100%");
                    }
                });
                $("#grid_naumen_cat").data("kendoGrid").dataSource.read();
                $("#grid_naumen_cat").data("kendoGrid").bind("change", function (e) {
                    var selectedRows = this.select();
                    for (var i = 0; i < selectedRows.length; i++) {
                        var dataItem = this.dataItem(selectedRows[i]);
                        if (!isNaN(dataItem.Id))
                            $("#grid_naumen_dishes").data("kendoGrid").dataSource.filter({ field: "CatId", operator: "eq", value: dataItem.Id });
                    }
                });


                $("#box_naumen_dishes").append("<div id='grid_naumen_dishes'></div>");
                $("#grid_naumen_dishes").kendoGrid({
                    columns: [
                        { field: "Barcode", title: "Баркод", width: barWidth }, 
                        { field: "Name", title: "Название" }],
                    selectable: "row",
                    height: isMobile ? "100%" : 630,
                    resizable: false,
                    dataSource: new kendo.data.DataSource({
                        data: data.Dishes,
                        //filter: { field: "CatId", operator: "eq", value: 0 }
                    }),
                    dataBound: function () {
                        $('#grid_naumen_dishes .k-grid-content').height("100%");
                    }
                });
                $("#grid_naumen_dishes").data("kendoGrid").dataSource.read();

                $("#window_select_naumen").data("kendoWindow").setOptions({title: "Выбор блюда из Naumen"});
                $("#window_select_naumen").data("kendoWindow").center().open();
            }
            else
                onExit();
        },
        error: function (data) {
            alert("Ошибка соединения c Naumen");
        }
    });

}

function BarcodSelectMenu() {
    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetBarcodesFromMenu",
        global: false,
        type: "GET",
        success: function (data) {
            var tttt = typeof (data);
            if (typeof (data) == "object") {
                var grid = $("#grid_naumen_cat").data("kendoGrid");
                if (grid) {
                    grid.destroy();
                }
                $("#grid_naumen_cat").remove();

                var grid = $("#grid_naumen_dishes").data("kendoGrid");
                if (grid) {
                    grid.destroy();
                }
                $("#grid_naumen_dishes").remove();

                //отфильтрованный от дублей список
                let DishesFiltered = data.Dishes.filter((elem, index, self) => self.findIndex(
                    (t) => {return (t.Barcode === elem.Barcode)}) === index);

                var barWidth = "100px";
                var isMobile = ($(window).width() < 1000 || $(window).height() < 600) 
                if (isMobile) {
                    //$("#naumen_tables").width("100%");
                    //$("#naumen_tables").css("width", "100%");
                    $("#box_naumen_cat").css("width", "25%");
                    $("#box_naumen_dishes").css("width", "70%"); 
                    $("#box_naumen_dishes").css("margin-left", "3px");
                    $("#box_naumen_cat").css("height", "100%");
                    $("#box_naumen_dishes").css("height", "100%"); 
                    $("#naumen_tables").css("height", "93%");
                    $("#naumen_tables").width("93%");
                    $("#naumen_buttons").css("height", "7%");
                    barWidth = "70px"
                }

                $("#box_naumen_cat").append("<div id='grid_naumen_cat'></div>");
                $("#grid_naumen_cat").kendoGrid({
                    columns: [{ field: "Name", title: "Категория", width: "100px" }],
                    selectable: "row",
                    sortable: true,
                    height: isMobile ? "100%" : 630,
                    resizable: false,
                    dataSource: data.Cats,
                    dataBound: function () {
                        $('#grid_naumen_cat .k-grid-content').height("100%");
                    }
                });
                $("#grid_naumen_cat").data("kendoGrid").dataSource.read();
                $("#grid_naumen_cat").data("kendoGrid").bind("change", function (e) {
                    var selectedRows = this.select();
                    for (var i = 0; i < selectedRows.length; i++) {
                        var dataItem = this.dataItem(selectedRows[i]);
                        if (!isNaN(dataItem.Id)){
                            $("#grid_naumen_dishes").data("kendoGrid").setDataSource(data.Dishes);
                            $("#grid_naumen_dishes").data("kendoGrid").dataSource.filter({ field: "CatId", operator: "eq", value: dataItem.Id });
                        }
                    }
                });

                $("#box_naumen_dishes").append("<div id='grid_naumen_dishes'></div>");
                $("#grid_naumen_dishes").kendoGrid({
                    toolbar: [{
                        template: '<input type="text" class="" id="menu_search" style="width:300px" placeholder="введите контекст поиска..." value="" />'
                    }],
                    sortable: true,
                    columns: [
                        { field: "Barcode", title: "Баркод", width: barWidth }, 
                        { field: "Name", title: "Название" }],
                    selectable: "row",
                    height: isMobile ? "100%" : 630,
                    resizable: false,
                    dataSource: new kendo.data.DataSource({
                        data: DishesFiltered,
                        //filter: { field: "CatId", operator: "eq", value: 0 }
                    }),
                    dataBound: function () {
                        $('#grid_naumen_dishes .k-grid-content').height("100%");
                        $('#grid_naumen_dishes .k-auto-scrollable').height("90%");
                    }
                });
                $("#grid_naumen_dishes").data("kendoGrid").dataSource.read();

                $("#menu_search").on("keyup", function () {
                    if ($("#menu_search").val() == ""){
                        var selectedRows = $("#grid_naumen_cat").data("kendoGrid").select();
                        for (var i = 0; i < selectedRows.length; i++) {
                            var dataItem = $("#grid_naumen_cat").data("kendoGrid").dataItem(selectedRows[i]);
                            if (!isNaN(dataItem.Id)){
                                $("#grid_naumen_dishes").data("kendoGrid").setDataSource(data.Dishes);
                                $("#grid_naumen_dishes").data("kendoGrid").dataSource.filter({ field: "CatId", operator: "eq", value: dataItem.Id });
                            }
                        }
                    }else{
                        $("#grid_naumen_dishes").data("kendoGrid").setDataSource(DishesFiltered);
                        $("#grid_naumen_dishes").data("kendoGrid").dataSource.filter({ field: "Name", operator: "contains", value: $("#menu_search").val() });
                    }                    
                    $('#grid_naumen_dishes .k-auto-scrollable').height("90%");
                });

                $("#window_select_naumen").data("kendoWindow").setOptions({title: "Выбор блюда из меню"});
                $("#window_select_naumen").data("kendoWindow").center().open();
            }
            else
                onExit();
        },
        error: function (data) {
            alert("Ошибка соединения c сервером");
        }
    });

}

function BarcodConfirmNaumen() {
    var grid = $("#grid_naumen_dishes").data("kendoGrid")
    var selectedRows = grid.select();
    var barcod = null;
    var name = null;
    for (var i = 0; i < selectedRows.length; i++) {
        var dataItem = grid.dataItem(selectedRows[i]);
        if (!isNaN(dataItem.Barcode)) {
            barcod = dataItem.Barcode;
            name = dataItem.Name;
        }
    }
    if (barcod == null) {
        alert("Выберите блюдо");
        return;
    }
    $('#numdocsp_input').val(barcod);
    $("#numdoc_desc").val(name)
    $("#window_select_naumen").data("kendoWindow").center().close();
}
function ShowPhoto(filePath, allowDelete) {
    var sizePar = "height";
    var isMobile = ($(window).width() < 1000 || $(window).height() < 600)
    if (isMobile) {
        if ($(window).height() > $(window).width())
            sizePar = "width";
    }

    $("#photo_preview_class").val(allowDelete ? "photoPreviewEdit" : "photoPreviewView");
    $("#photo_delete_button").css("display", allowDelete ? "inline-block" : "none");
    $("#photo_content").empty();
    $("#photo_content").append($("<img class='photo' style='" + sizePar + ":99%' src='" + filePath + "'/>"));
    $("#photo_download_link").attr("href", filePath);



    $("#window_photo").data("kendoWindow").center().open();
    // Если баркод не указан, вывести сообщение
    //Data.QuestionGroupContent[id].Coment = $("#coment_" + id).val();
}

function TogglePhoto(toNext) {
    var fileName = $("#photo_content").children().first().attr("src");
    var nowInd = 0;
    var maxInd = 0;
    var previewClass = $("#photo_preview_class").val();
    
    $("." + previewClass).each(function (index) {
        maxInd = index;
        if ($(this).attr("src") == fileName)
            nowInd = index;
    })
    nowInd += toNext ? 1 : -1;
    if (nowInd >= 0 && nowInd <= maxInd) {
        $("." + previewClass).each(function (index) {
            if (index == nowInd)
                fileName = $(this).attr("src")
        })
        $("#photo_content").empty();
        $("#photo_content").append($("<img class='photo' src='" + fileName + "'/>"));
        $("#photo_download_link").attr("href", fileName);
    }
    /*
    if (fileName.indexOf("(") == -1) {
        if (toNext)
            fileName = fileName.replace(".", "(1).")
        else
            return;
    }
    else {
        if (!toNext && fileName.indexOf("(1)") != -1)
            fileName = fileName.replace("(1)", "");
        else {
            var baseName = fileName.slice(0, fileName.indexOf("(") + 1);
            var baseNameEnd = fileName.slice(fileName.indexOf(")"));
            var number = fileName.slice(fileName.indexOf("(") + 1, fileName.indexOf(")"))
            number = Number(number) + (toNext ? 1 : -1);
            fileName = baseName + String(number) + baseNameEnd
        }
    }

    var request = new XMLHttpRequest();
    request.open('GET', fileName, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 404) {
            } else {
                $("#photo_content").empty();
                $("#photo_content").append($("<img class='photo' src='" + fileName + "'/>"));
                $("#photo_download_link").attr("href", fileName );
            }
        }
    };
    request.send();*/
}

function DeletePhoto() {
    if (!confirm("Подтвердите удаление фото"))
        return;
    var fileNameWithRnd = $("#photo_content").children().first().attr("src");
    var fileName = fileNameWithRnd;
    if (fileName.indexOf("?") != -1)
        fileName = fileName.slice(0, fileName.indexOf("?"));
    if (fileName == "" || fileName == null)
        return;

    $.ajax({
        type: "POST",
        url: "https://" + host + "/complaints/api/checklist/DeleteAttachment",
        contentType: "application/json",
        data: JSON.stringify(fileName),
        success: function (data) {
            // Найти в форме родительский превью и удалить его
            var previewClass = $("#photo_preview_class").val();

            $("." + previewClass).each(function () {
                if ($(this).attr("src") == fileNameWithRnd)
                    $(this).remove();
            })

            Data.QuestionGroupContent[CurentQuestionGroup].Attachments = Data.QuestionGroupContent[CurentQuestionGroup].Attachments.filter(_att => _att != fileName)
            //for (var i = Data.QuestionGroupContent[CurentQuestionGroup].Attachments.length - 1; i >= 0; i--) {
            //    if (Data.QuestionGroupContent[CurentQuestionGroup].Attachments[i] == fileName)
            //        Data.QuestionGroupContent[CurentQuestionGroup].Attachments = Data.QuestionGroupContent[CurentQuestionGroup].Attachments.splice(i, 1)
            //}                        

            //$(".photoPreview").find("[src$='" + fileName + "']").remove();
            $("#window_photo").data("kendoWindow").center().close();
        },
        error: function (data) {
            alert("Ошибка при удалении файла")
        }
    });

}

function DocNumChanged() {
    if (isNaN($("#numdocsp_input").val()) || $("#numdocsp_input").val() == "" || $("#numdocsp_input").val() == null || Data == null || Data.CheckList == null)
        return;
    var barcode = Number($("#numdocsp_input").val())
    if (Data.CheckList.DocNumMode == 2) {
        $.ajax({
            url: "https://" + host + "/complaints/api/info/GetBarcodeName?CodGood=" + String(barcode),
            global: false,
            type: "GET",
            success: function (data) {
                $("#numdoc_desc").val(data)
            }
        })
    }
}

function ShopPaharLog(operWindow) {
    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetPaharLog",
        global: false,
        type: "GET",
        success: function (data) {
            var tttt = typeof (data);
            if (typeof (data) == "object") {
                var grid = $("#grid_pahar_log").data("kendoGrid");
                if (grid) {
                    grid.destroy();
                }
                $("#grid_pahar_log").remove();


                $("#box_pahar_log").append("<div id='grid_pahar_log'></div>");
                $("#grid_pahar_log").kendoGrid({
                    columns: [
                        {
                            field: "Day",
                            title: "Число",
                            width: "100px",
                            template: function (dataItem) { return kendo.toString(kendo.parseDate(dataItem.Day), 'dd.MM.yyyy'); }
                        },
                        {
                            field: "Records",
                            title: "Дата старта / Дата финиша / Результат",
                            template: function (dataItem) {
                                var res = "";

                                if (dataItem.Records != null && dataItem.Records.length > 0) {
                                    res = "<table border=0 width='100%'>";

                                    dataItem.Records.forEach(function (rec) {
                                        res += "<tr>"
                                        res += "<td width='120'>" + kendo.toString(kendo.parseDate(rec.StartDate), 'dd.MM.yyyy HH:mm'); +"</td>"
                                        res += "<td width='120'>" + (rec.FinishDate != null ? kendo.toString(kendo.parseDate(rec.FinishDate), 'dd.MM.yyyy HH:mm') : ""); +"</td>"
                                        res += "<td width='360'>" + rec.ResultStr +"</td>"
                                        res += "</tr>"
                                    })

                                    res += "</table>"
                                }

                                return res;
                            }
                        }],
                    selectable: "row",
                    resizable: false,
                    dataSource: data,
                    dataBound: function () {
                        $('#grid_pahar_log .k-grid-content').height("100%");
                    }
                });
                $("#grid_pahar_log").data("kendoGrid").dataSource.read();

                if (operWindow)
                    $("#window_pahar_log").data("kendoWindow").center().open();
            }
            //else
            //    onExit();
        },
        error: function (data) {
            alert("Ошибка соединения c сервером");
        }
    });



}



function PahRecalcPahar() {
    var grid = $("#grid_pahar_log").data("kendoGrid")
    var selectedRows = grid.select();
    var day = null;
    for (var i = 0; i < selectedRows.length; i++) {
        var dataItem = grid.dataItem(selectedRows[i]);
        if (dataItem.Day != null) {
            day = dataItem.Day;
        }
    }
    if (day == null) {
        alert("Дата не выбрана");
        return;
    }
    day = kendo.toString(kendo.parseDate(day), 'yyyyMMdd');
    var pwd = prompt("Введите сервисный код");
    if (pwd != null && pwd != "") {
        $.ajax({
            url: "https://" + host + "/complaints/api/info/RecalcPahar?FStartDate=" + day + "&FEndDate=" + day,
            global: false,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(pwd),
            success: function (data) {
                if (!isNaN(data)) {
                    alert("Запрос на расчет показателей принят. Ожидайте");
                    ShopPaharLog(false);
                }
                else
                    alert(data);
            },
            error: function (data) {
                alert("Ошибка запроса/неверный сервисный код");
            }
        });
    }
}

function PahLogResetState() {
    var pwd = prompt("Введите сервисный код");
    if (pwd != null && pwd != "") {
        $.ajax({
            url: "https://" + host + "/complaints/api/info/ResetPaharLogStates",
            global: false,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(pwd),
            success: function (data) {
                if (data == true) {
                    alert("States has reset");
                    ShopPaharLog(false);
                }
            },
            error: function (data) {
                alert("Ошибка запроса/неверный сервисный код");
            }
        });
    }
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

    var DT = $("#datepickerstart_staff_turnover").val().split('/');
    var FDate = DT[2] + DT[1] + DT[0];
    DT = $("#datepickerend_staff_turnover").val().split('/');
    var EDate = DT[2] + DT[1] + DT[0];
    var filtersGet = "FDate=" + FDate + "&EDate=" + EDate;


    var depId = $("#staff_turnover_deps").val();;
    if (depId != "" && depId != "ALL" && depId.toLowerCase() != "все")
        filtersGet += "&CodShop=" + depId;

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
            }
            for (var j = 0; j < empl.HasInRefPoint.length; j++) {
                newObj["Date" + String(j + 1)] = empl.HasInRefPoint[j]
            }
            data_source.push(newObj)
        })
    })



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

function StaffTurnoverModeChange(mode) {

    WaitShow("staff_turnover_report");

    // mode = 0 - DepsOnly
    // mode = 1 - Deps and positions
    // mode = 2 - Depa and emloyees

    var data_source = []

    var staffTable = []


    var startDate = $("#datepickerstart_staff_turnover").data("kendoDatePicker").value();
    var endDate = $("#datepickerend_staff_turnover").data("kendoDatePicker").value();
    var diffDays = Math.round((endDate - startDate) / 1000 / 60 / 60 / 24);

    var staffPositions = []
    $("#grid_staffing").data("kendoGrid").columns.forEach(_col => {
        if (_col.field.indexOf("Count") != -1) {
            var posId = _col.field.replace("Count", "")
            if (!isNaN(posId))
                staffPositions.push(Number(posId))
        }
    })

    var data = $("#grid_staffing").data("kendoGrid").dataSource;
    data.data().forEach(function (item) {
        var counts = []
        staffPositions.forEach(function (posId) {
            var field = "Count" + String(posId)
            counts.push({ posId: posId, count: item[field] != null ? item[field] : 0 })
        })
        counts.push({ posId: 0, count: item.CountAll != null ? item.CountAll : 0 })

        staffTable.push({
            DepNum: item.DepNum,
            DepName: item.DepName,
            Counts: counts
        })
    })


    var countsAll = []


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
                StaffCount: 0,//1,
                StaffDismissed: (isDismissed ? 1 : 0)
            };
            data_source.push(dataDep)
            depsCount++;
        }
        else {
            //dataDep.StaffCount += 1
            dataDep.StaffDismissed += (isDismissed ? 1 : 0)
            dataDep.StaffTable = GetStaffTableCount(staffTable, item.DepNum, null)
        }

        if (mode == 1) {
            if (dataPos == null) {
                dataPos = {
                    DepNum: item.DepNum,
                    DepName: item.DepName,
                    PosId: item.PositionId,
                    PosName: item.PositionName,
                    StaffTable: GetStaffTableCount(staffTable, item.DepNum, item.PositionId),
                    StaffCount: 0,//1,
                    StaffDismissed: (isDismissed ? 1 : 0)
                };
                data_source.push(dataPos)
            }
            else {
                //dataPos.StaffCount += 1
                dataPos.StaffDismissed += (isDismissed ? 1 : 0)
            }
        }
    })


    if (depsCount > 1) {
        data_source.forEach(function (dataItem) {
            if (mode == 1 || dataItem.PosId == 0) {
                var cnt = countsAll.filter(_cnt => _cnt.PosId == dataItem.PosId)
                if (cnt.length > 0) {
                    cnt[0].StaffTable += dataItem.StaffTable
                    cnt[0].StaffCount += dataItem.StaffCount
                    cnt[0].StaffDismissed += dataItem.StaffDismissed
                }
                else
                    countsAll.push({
                        PosId: dataItem.PosId,
                        PosName: dataItem.PosId == 0 ? null : dataItem.PosName,
                        StaffTable: dataItem.StaffTable,
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

    },
    {
        field: "StaffTable",
        title: "ШР",
        width: "80px"
    },
    {
        field: "StaffPercent",
        title: "Укомплектованность",
        width: "100px",
        template: function (dataItem) { return dataItem.StaffTable > 0 ? (String(Math.round(dataItem.StaffCount / dataItem.StaffTable * 100)) + " %") : "" }
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




function SelectStaffTurnoverDeps() {
    //staff_turnover_deps
    var grid_staffturnover_deps = $("#grid_staffturnover_deps").data("kendoGrid");
    if (grid_staffturnover_deps) {
        grid_staffturnover_deps.destroy();
    }
    $("#grid_staffturnover_deps").remove();

    var selectedDeps = $("#staff_turnover_deps").val().split(',');

    $.ajax({
        url: "https://" + host + "/complaints/api/info/getdepartments",
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof (data) == "object") {

                var deps = data.filter(_dep => _dep.isActive);
                deps.sort(function (a, b) { return a.DepNum - b.DepNum; });
                var data_source = deps.map(function (_dep) { return { Sel: selectedDeps.indexOf(String(_dep.DepNum)) != -1, Num: _dep.DepNum, Name: _dep.DepName, Place: (_dep.Place.toLowerCase().trim() == "город" ? null : "Аэро") }; });


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







            } else {
                onExit();
            }
        }
    });


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

        row.cells[3].value = dataItem.StaffTable > 0 ? (String(Math.round(dataItem.StaffCount / dataItem.StaffTable * 100)) + " %") : ""

        row.cells[6].value = dataItem.StaffCount > 0 ? (String(Math.round((dataItem.StaffDismissed / dataItem.StaffCount) * 100)) + " %") : ""

        row.cells[7].value = dataItem.StaffCount > 0 ?
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
        url: "https://" + host + "/complaints/api/Info/DeleteStaffEmployeeVacation",
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
        url: "https://" + host + "/complaints/api/Info/" + "AddStaffEmployeeVacation",
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


function WaitShow(page) {
    $("#grid_" + page).css("display", "none");
    $("#box_" + page).append('<img id="gridWait_' + page + '" style="width: 10%; margin-top:50px;margin-left:45%; margin-right:45%" src="https://s2010/feedback/wait5.gif" />');
}

function WaitHide(page, msg) {
    $("#gridWait_" + page).remove();
    if (msg != null)
        alert(msg);
    $("#grid_" + page).css("display", "block");
}



function RefreshStaffing() {
    var grid = $("#grid_staffing").data("kendoGrid");
    if (grid) {
        grid.destroy();
    }
    $("#grid_staffing").remove();

    //WaitShow("staffing");

    $.ajax({
        url: "https://" + host + "/complaints/api/info/GetStaffingTable",
        global: false,
        type: "GET",
        success: function (data) {
            //WaitHide("staffing", null);
            if (typeof (data) == "object") {
                PrepareStaffingData(data)
            };
        },
        error: function () {
            //WaitHide("staffing", "Произошла ошибка при загрузке штатных расписаний");
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
            editable: function () { return false }// userCanChangeOnlyStaffTableData; }
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
        toolbar: ["excel"],
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
            var posId = Number(col.replace("Count", ""))
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
                            var allHtml = "<b>" + String(summ) + "</b>";
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


// *******************************************************************************************************************************************
// ********* доработки для вывода отчета СанПин

//функция генерации структуры столбцов
function generateColumns(columnCount){
    columns =[];

    columns.push({
        field: "DepName",
        title: "Подразделение",
        width: "150px",
        encoded: false,
        locked: true,
        lockable: false,
        attributes: {style: "text-align: center; font-weight: bold; font-size: 120%;"},
    });
    columns.push({
        field: "CheckListName",
        title: "Отчет",
        width: "120px",
        encoded: false,
        locked: true,
        lockable: false,
    });
    //столбцы с результатами
    for (var i = 0; i < columnCount; i++){
        columns.push({
            field: "StatCol_" + i,
            title: " ",
            width: "85px",
            encoded: false,
            attributes: {style: "text-align: center;"},
        });    
    }
    return columns;
}

//функция отображения отчета СанПин
function ReportSanPin2(data) {

    var iMax = 0;
    //вичисляем максимальное количество столбцов в отчете 
    data.forEach(function (item) {
        item.CheckListStats.forEach(function (it, idx) {
            it.Stats.forEach(function (items, idx) {
                if (idx > iMax) iMax = idx
            });
        });
    });
	console.log(iMax);
	
	newData = [];
	//цикл по записям
	data.forEach(function (item) {
		item.CheckListStats.forEach(function (stats){
			newRow = {};
			newRow.DepId = item.DepId;
			newRow.DepName = item.DepName;
			newRow.CheckListId = stats.CheckListId;
			newRow.Summary = stats.Summary;
			newRow.LastStat = stats.LastStat;
            newRow.ExportCheckListName = stats.CheckListName;

            //ячейка с суммарной статистикой
            if (stats.Summary != null && stats.Summary.MedianAsc != null) {
                newRow.CheckListName = '<b>' + stats.CheckListName + '</b><br> Медиана: <span style="color:blue">' + kendo.toString(stats.Summary.MedianAsc, "##") + '</span><br> Сред.знач.: ' + kendo.toString(stats.Summary.Avg, "##");
                newRow.ExportMedianAsc = kendo.toString(stats.Summary.MedianAsc, "##");
                newRow.ExportAvg = kendo.toString(stats.Summary.Avg, "##");
            }
            else {
                newRow.CheckListName = '<b>' + stats.CheckListName + '</b><br>' + stats.LastStat.StatDate.substring(0, 10) + ' <br>' + stats.LastStat.StatRatio;
                newRow.ExportMedianAsc = "-";
                newRow.ExportAvg = stats.LastStat.StatRatio;
            }

			let i = 0;
            //цикл по показателям
			stats.Stats.forEach(function (stat){				

                let statHTML = "";
                let img = "";
                let title = "";
                if (stat.HasPhoto){
                    img = '<img src="https://' + host + '/feedback/img/IconPhoto.png" style="margin-left:10px;margin-bottom:2px;">';
                }                    
                if (stat.StatDocNum != null){
                    title = 'title="' + stat.StatDocNum + '"';
                }
                if (stat.StatCompleted == true) {
                    statHTML = '<div style="display: inline-block; cursor:pointer" onclick="ShowDetail('+newRow.CheckListId+','+ newRow.DepId+', \''+stat.StatDate+'\', '+stat.StatDocNum+');">' + stat.StatDate.substring(0, 10) + ' <br>' + stat.StatRatio + img + '</div>';                        
                }
                else {
                    statHTML = stat.StatDate.substring(0, 10) + '<br>' + stat.StatRatio + img;
                }

                newRow['StatCol_' + (i)] = statHTML;
                newRow['ExportStatCol_' + (i++)] = stat.StatDate.substring(0, 10) + ' ' + stat.StatRatio;
			});
            //дозаполнение пустотой недостающих столбцов
			for(var j = i; j < iMax; j++){
                newRow['StatCol_' + (j)] = "";				
            }
            newData.push(newRow);
		});		
	});

    var grid = $("#grid_sanpin2").data("kendoGrid");
    if(grid){
        grid.destroy();
    }
    $("#grid_sanpin2").empty();

    grid = $("#grid_sanpin2").kendoGrid({
        toolbar: ["excel"],
		dataSource: newData,
		columns: generateColumns(iMax),
		pageable: false,
		editable: false,
        width: "1000px",
		height: "700px",
        dataBound: function(e) {
            mergeGridRows("grid_sanpin2");
        },
        excelExport: exportPrintForm,
        selectable: false,
	});    
}

//функция слияния ячеек для одного подразделения 
function mergeGridRows(gridId) {

    let first_td = null;
    var curBG = "#ffffff";

    //перебираем заблокированную таблицу и сливаем ячейки
    $('#' + gridId + '>.k-grid-content-locked>table').find('tr').each(function () {
        var current_td = $(this).find('td:first-child');
        if (!first_td) {
            first_td = current_td;
            first_td.css('background-color', curBG);            
        } else if (current_td.text() == first_td.text()) {			
            current_td.remove();
            first_td.attr('rowspan', !first_td.attr('rowspan') ? 2 : Number(first_td.attr('rowspan')) + 1);
        } else {
            first_td = current_td;
            curBG = (curBG == "#ffffff"? "#eeeeee": "#ffffff");
            first_td.css('background-color', curBG);            
        }
    });

    //исправляем ошибку форматирования фиксированной части таблицы
	if ($('#' + gridId + '>.k-grid-content-locked').css('height')){
		let newH = Number($('#' + gridId + '>.k-grid-content-locked').css('height').replace("px","")) + 16;
		$('#' + gridId + '>.k-grid-content-locked').css('height', newH + 'px');
	}
}

//формирование выгрузки отчета по СанПин в Excel
function exportPrintForm(e){
    let sheet = e.workbook.sheets[0];
    let first_instance_idx = null;
    let src = $("#grid_sanpin2").data("kendoGrid").dataSource.data();        

    //добавляем в перкую строку (шапку) название столбцов
    sheet.rows[0].cells.splice(2,0,
        {value: "Медиана", background: sheet.rows[0].cells[0].background, color: sheet.rows[0].cells[0].color}, 
        {value: "Сред.знач.", background: sheet.rows[0].cells[0].background, color: sheet.rows[0].cells[0].color}
    );    

    //цикл по строкам итоговой выгрузки
    for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
        var row = sheet.rows[rowIndex];
        
        row.height = 40;

        //удаляем комплексный столбец и добавляем 2 индивидуальных
        row.cells.splice(1, 1, 
            {value: src[rowIndex-1].ExportCheckListName}, 
            {value: src[rowIndex-1].ExportMedianAsc, textAlign: "center", format: "0"}, 
            {value: src[rowIndex-1].ExportAvg, textAlign: "center", format: "0"}
        );
        
        //перезаполняем данные в ячейках с результатами без html-разметки
        for (var cellIndex = 4; cellIndex < row.cells.length; cellIndex ++) {
            if (row.cells[cellIndex].value != ""){
                row.cells[cellIndex].value = src[rowIndex-1]['ExportStatCol_' + (cellIndex - 4)];
                row.cells[cellIndex].wrap = true;
                row.cells[cellIndex].textAlign = "center";                
                if (!sheet.columns[cellIndex]){
                    sheet.columns.push({width: 85, autoWidth: false});
                }                    
            }
        }

        //сливаем ячейки для одного подразделения и устанавливаем выравнивание
        if (first_instance_idx == null) {
            first_instance_idx = rowIndex;
            row.cells[0].verticalAlign = "center";
        } else if (row.cells[0].value == sheet.rows[first_instance_idx].cells[0].value) {
            row.cells.splice(0, 1);
            if(sheet.rows[first_instance_idx].cells[0].rowSpan)
                sheet.rows[first_instance_idx].cells[0].rowSpan += 1; 
            else
                sheet.rows[first_instance_idx].cells[0].rowSpan = 2;
        } else {
            first_instance_idx = rowIndex;
			row.cells[0].verticalAlign = "center";
        }
    }
}

