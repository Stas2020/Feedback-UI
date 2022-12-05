
var dep_list;

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

            var value = item.Values[key];
            var dep_name = GetNameDepartmen(key);

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