
var dep_list;


var refSymDone = "✅";
var refSymNotDone = "❌";
var refSymNoData = "❔";



$(document).ready(function () {

    /*
    $.ajax({
        url: "https://s2010/complaints/api/info/getdepartments",
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
        url: "https://s2010/complaints/api/info/getdepartments",
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

function GetDataPahar() {

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
        url: "https://s2010/complaints/api/info/GetIndicatorTable?FStartDate="+FStartDate+"&FEndDate="+FEndDate,
        global: false,
        type: "GET",
        success: function (data) {
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


    var SD = $("#datepickerstart_pah").val().split('/');
    var ED = $("#datepickerend_pah").val().split('/');


    var FStartDate = SD[2]+SD[1]+SD[0];
    var FEndDate = ED[2]+ED[1]+ED[0];

    var refResults = $("#pah_ref_results").is(":checked") ?"&RefResults=true":"";
    var refValues = $("#pah_ref_values").is(":checked") ?"&RefValues=true":"";

    $.ajax({
        url: "https://s2010/complaints/api/info/GetIndicatorTable?FStartDate=" + FStartDate + "&FEndDate=" + FEndDate + refResults + refValues,
        global: false,
        type: "GET",
        success: function (data) {
            if (typeof(data) == "object") {
                PrepareData(data)
            };
        }
    })


}

function RefsPah() {
    if (RefEqualsTypes == null) {
        $.ajax({
            url: "https://s2010/complaints/api/info/GetEqualTypes",
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
            url: "https://s2010/complaints/api/info/GetReportsTypes",
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
            url: "https://s2010/complaints/api/checklist/GetCheckListsCollection",
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
        url: "https://s2010/complaints/api/info/GetReferenceValues",
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
                        dateMonth = "Месяц: " + (month < 10 ? '0' + month : month) + "." + String(date.getFullYear());
                        itemText += "</br>" + dateMonth;
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
        columns.field = "field"+col;
        columns.title = item.Caption;
        columns.format = GetFormat(item.FormatString);
	columns.headerAttributes = { style: "white-space: normal; vertical-align: top;"};// middle
        //columns.headerAttributes = {class: "table-header-cell_"};
        ListColumn.push(columns);


        Object.keys(item.Values).map(function(key, index) {

            var value;
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
                    //value += "<br/>[" + item.ReferenceFormatedValues[key] + "]";
                    //value += "<br/>[" + item.ReferenceFormatedValues[key] + "]";
                //value = value.replace(" ", "&nbsp;");

                //columns.encoded = false;
            }
            else
                value = item.Values[key];


            var hasDep = false;
            data_source.forEach(function (value1) {
                if (value1.field0 == dep_name) {
                    value1["field" + col] = value;
                    hasDep = true;
                }
            });
            if (!hasDep) {
                var obj = new Object();
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

        for (var rowIndex = 1/*0*/; rowIndex < sheet.rows.length; rowIndex++) {
            var row = sheet.rows[rowIndex];
            for (var cellIndex = 1/*0*/; cellIndex < row.cells.length; cellIndex++) {
                var cell = row.cells[cellIndex];
                if (row.type === "data") {
                    if (colFormats[sheet.rows[0].cells[cellIndex].value] != null) {
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
                    }
                }
            }
        }
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
        height: 750,
        resizable: true,
        navigatable: true,
        dataSource: data_source
    });

    $("#grid_pahar").data("kendoGrid").dataSource.sort({field: "field0", dir: "asc"});
    $("#grid_pahar").data("kendoGrid").dataSource.read();
}