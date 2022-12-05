

var List_DS_Question = [];
var DS_AllQuestions;
var DS_QuestionGroup;

var CheckListId;
var CheckListName;


function init_editCheckList()
{
    $("#window_new_checklist").kendoWindow({
        width: "380px",
        height: "150px",
        title: "Новый чеклист",
        visible: false,
        actions: [
            "Close"
        ]
    });



    $.ajax({
        url: "https://s2010/complaints/api/info/GetQuestionsCollection",
        global: false,
        type: "GET",
        success: function(data){
            if (typeof(data) ==  "object")
            {
                QuestionsCollection = data;
            }
            else
            {
                Exit();
            }

        }
    });


    $.ajax({
        url: "https://s2010/complaints/api/checklist/GetCheckListsCollection",
        global: false,
        type: "GET",
        success: function(data){
            if (typeof(data) ==  "object")
            {
                var ListCheckList = data;

                $("#check_list_edit").kendoComboBox({
                    dataTextField: "CheckListName",
                    dataValueField: "CheckListId",
                    dataSource: ListCheckList,
                    change: onChangeCheckListEdit,

                });

            }
            else
            {
                Exit();
            }

        }
    });


    $.ajax({
        url: "https://s2010/complaints/api/info/GetFunctionCheckList",
        global: false,
        type: "GET",
        success: function(data){
            if (typeof(data) ==  "object")
            {
                var FunctionCheckList = data;

                $("#FunctionCheckList").kendoComboBox({
                    dataTextField: "FunctionName",
                    dataValueField: "FunctionId",
                    dataSource: FunctionCheckList,
                    change: onChangeFunctionCheckList,

                });

            }
            else
            {
                Exit();
            }

        }
    });

}

function onChangeFunctionCheckList()
{


}

function OpenN()
{
    $("#window_new_checklist").data("kendoWindow").center().open();
}

function NewCheckList()
{

    $("#window_new_checklist").data("kendoWindow").close();
    var CheckListName = $("#checklistname").val();

    $.ajax({
        url: "https://s2010/complaints/api/checklist/PostCheckList?description="+CheckListName,
        global: false,
        type: "POST",
        success: function(data){
            if (data && data != -1)
            {
                CheckListId = data;

                DestroyGridForEditing();

                Prepare_DS_AllQuestions();
                Prepare_Clean_DS_QuestionGroup();

                CreateGridForEditing();
            }
            else
            {
                Exit();
            }

        }
    });


}

function OpenCheckList()
{
    if(!CheckListId)
    {
        alert("Выберите чеклист!");
        return;
    }
    $.ajax({
        url: "https://s2010/complaints/api/info/GetCheckListForEditing?id="+CheckListId,
        global: false,
        type: "GET",
        success: function(data){
            if (typeof(data) ==  "object")
            {
                CheckListForEditing = data;
                DestroyGridForEditing();

                Prepare_DS_AllQuestions();
                Prepare_DS_QuestionGroup();

                CreateGridForEditing();
            }
            else
            {
                Exit();
            }

        }
    });




}

function Exit()
{
    alert("Произошла онибка!");
}

function onChangeCheckListEdit()
{
    CheckListId =  $("#check_list_edit").val();
}
function DestroyGridForEditing()
{
    var grid = $("#sanpin_question_Editor").data("kendoGrid");
    if (grid)
    {
        grid.destroy();
    }

}
function CreateGridForEditing()
{
    $("#sanpin_question_Editor").kendoGrid({
        dataSource: DS_QuestionGroup,
        pageable: false,
        height: 750,
        toolbar: [{name: "create",text: "Добавить группу"}],
        detailInit: detailInitEditCheckList,
        detailTemplate: kendo.template($("#detail-template_edit").html()),
        columns: [
            { field:"QuestionGroupName",title:"Название группы", width: "90%"  },
            { command: [{name:"destroy",text: "Удалить", title: "", width: "10%"}] }
        ],
        editable: true
    });
}

function SaveQuestionGroup(QuestiomGroupName)
{
    var QuestionGroupId = -1;
    $.ajax({
        url: "https://s2010/complaints/api/checklist/PostGroup?description="+QuestiomGroupName,
        global: false,
        type: "POST",
        async: false,
        success: function(data) {
            if (typeof(data) == "object") {


                QuestionGroupId = data.QuestionGroupId;

                $.ajax({
                    url: "https://s2010/complaints/api/checklist/PostCheckListContent?CheckListId="+CheckListId+"&QuestionGroupId="+QuestionGroupId,
                    global: false,
                    type: "POST",
                    success: function(data) {
                        if (data && data != -1) {

                            var DS = new kendo.data.DataSource({
                                data: [],
                                change: function(e) {

                                    if(e.action == "add")
                                    {

                                    }
                                    if(e.action == "itemchange")
                                    {
                                        if(e.items[0].id)
                                        {
                                            //change
                                            var Question_id = e.items[0].id;
                                            var QuestionName = e.items[0].name;
                                            ChangeQuestion(Question_id,QuestionName);
                                        }
                                        else
                                        {
                                            //new
                                        }

                                    }
                                    if(e.action == "remove")
                                    {
                                        var Question_id = e.items[0].id;
                                        var QuestionName = e.items[0].name;
                                        RemoveQuestionOfGroup(QuestionGroupId,Question_id);
                                    }

                                }
                            });

                            List_DS_Question[QuestionGroupId] = DS;

                        }
                        else
                        {
                            Exit();
                        }
                    }
                });



            }
        }
    });

    return QuestionGroupId;
}
function ChangeQuestionGroup(QuestionGroupId,QuestiomGroupName)
{
    $.ajax({
        url: "https://s2010/complaints/api/checklist/PutGroup?id="+QuestionGroupId+"&QuestionGroupName="+QuestiomGroupName,
        global: false,
        type: "PUT",
        success: function(data) {
            if (data && data != -1) {

            }
            else
            {
                Exit();
            }
        }
    });
}
function RemoveQuestionGroup(QuestionGroupId)
{
    $.ajax({
        url: "https://s2010/complaints/api/checklist/DeleteCheckListContent?CheckListId="+CheckListId+"&QuestionGroupId="+QuestionGroupId,
        global: false,
        type: "DELETE",
        success: function(data) {
            if (data && data != -1) {

            }
            else
            {
                Exit();
            }
        }
    });
}
function Prepare_Clean_DS_QuestionGroup()
{
    DS_QuestionGroup = new kendo.data.DataSource({
        data: [],
        change: function(e) {

            if(e.action == "add")
            {

            }
            if(e.action == "itemchange")
            {
                if(e.items[0].QuestionGroup_id)
                {
                    //change
                    var QuestionGroup_id = e.items[0].QuestionGroup_id;
                    var QuestionGroupName = e.items[0].QuestionGroupName;
                    ChangeQuestionGroup(QuestionGroup_id,QuestionGroupName);
                }
                else
                {
                    //new
                    var QuestionGroupName = e.items[0].QuestionGroupName;
                    e.items[0].QuestionGroup_id = SaveQuestionGroup(QuestionGroupName);
                }

            }
            if(e.action == "remove")
            {
                var QuestionGroup_id = e.items[0].QuestionGroup_id;
                RemoveQuestionGroup(QuestionGroup_id);

            }

        }
    });
}
function Prepare_DS_QuestionGroup()
{
    var data = [];
    CheckListForEditing.QuestionGroupsList.forEach(function (value) {
        var itm = new Object();
        itm.QuestionGroup_id = value.QuestionGroupId;
        itm.QuestionGroupName = value.QuestionGroupName;
        data.push(itm);

        var data_question = [];
        value.QuestionsList.forEach(function (value1) {

            var it = new Object();
            it.id = value1.QuestionId;
            it.name = GetNameQuestion(value1.QuestionId);
            data_question.push(it);

        })

        var DS = new kendo.data.DataSource({
            data: data_question,
            change: function(e) {

                if(e.action == "add")
                {

                }
                if(e.action == "itemchange")
                {
                    if(e.items[0].id)
                    {
                        //change
                        var Question_id = e.items[0].id;
                        var QuestionName = e.items[0].name;
                        ChangeQuestion(Question_id,QuestionName);
                    }
                    else
                    {
                        //new
                    }

                }
                if(e.action == "remove")
                {
                    var Question_id = e.items[0].id;
                    var QuestionName = e.items[0].name;
                    RemoveQuestionOfGroup(value.QuestionGroupId,Question_id);
                }

            }
        });
        List_DS_Question[value.QuestionGroupId] = DS;

    });



    DS_QuestionGroup = new kendo.data.DataSource({
        data: data,
        change: function(e) {

            if(e.action == "add")
            {

            }
            if(e.action == "itemchange")
            {
                if(e.items[0].QuestionGroup_id)
                {
                    //change
                    var QuestionGroup_id = e.items[0].QuestionGroup_id;
                    var QuestionGroupName = e.items[0].QuestionGroupName;
                    ChangeQuestionGroup(QuestionGroup_id,QuestionGroupName);
                }
                else
                {
                    //new
                    var QuestionGroupName = e.items[0].QuestionGroupName;
                    e.items[0].QuestionGroup_id = SaveQuestionGroup(QuestionGroupName);
                }

            }
            if(e.action == "remove")
            {
                var QuestionGroup_id = e.items[0].QuestionGroup_id;
                RemoveQuestionGroup(QuestionGroup_id);

            }

        }
    });


}
function SaveQuestion(QuestiomName)
{
    var QuestionId = -1;

    $.ajax({
        url: "https://s2010/complaints/api/checklist/PostQuestion?description="+QuestiomName,
        global: false,
        type: "POST",
        async:false,
        success: function(data) {
            if (typeof(data) == "object") {

                QuestionId = data.QuestionId;

            }
            else
            {
                Exit();
            }
        }
    });

    return QuestionId;
}
function RemoveQuestionOfGroup(QuestionGroup_id,Question_id)
{

    $.ajax({
        url: "https://s2010/complaints/api/checklist/DeleteGroupContent?QuestionGroupId="+QuestionGroup_id+"&QuestionId="+Question_id,
        global: false,
        type: "DELETE",
        success: function(data) {
            if (data && data != -1) {

            }
            else
            {
                Exit();
            }
        }
    });

}
function ChangeQuestion(QuestionId,QuestiomName)
{
    //отправить изменения на сервер
    $.ajax({
        url: "https://s2010/complaints/api/checklist/PutQuestion?id="+QuestionId+"&QuestionText="+QuestiomName,
        global: false,
        type: "PUT",
        success: function(data) {
            if (data && data != -1) {

                var dataItem = DS_AllQuestions.get(QuestionId);
                var index = DS_AllQuestions.indexOf(dataItem);
                if(dataItem)
                {
                    DS_AllQuestions.remove(dataItem);
                    dataItem.name = QuestiomName;
                    DS_AllQuestions.insert(index,dataItem);
                }


                List_DS_Question.forEach(function (value) {

                    var dataItem = value.get(QuestionId);
                    var index = value.indexOf(dataItem);
                    if(dataItem)
                    {
                        value.remove(dataItem);
                        dataItem.name = QuestiomName;
                        value.insert(index,dataItem);
                    }
                })

            }
            else
            {
                Exit();
            }
        }
    });



}

function Prepare_DS_AllQuestions()
{
    var data = [];
    QuestionsCollection.forEach(function (value) {
        var itm = new Object();
        itm.id = value.QuestionId;
        itm.name = value.QuestionText;
        data.push(itm);
    });

    DS_AllQuestions = new kendo.data.DataSource({
        data: data,
        change: function(e) {

            if(e.action == "add")
            {

            }
            if(e.action == "itemchange")
            {
                if(e.items[0].id)
                {
                    //change
                    var Question_id = e.items[0].id;
                    var QuestionName = e.items[0].name;
                    ChangeQuestion(Question_id,QuestionName);
                }
                else
                {
                    //new
                    var QuestionName = e.items[0].name;
                    e.items[0].id = SaveQuestion(QuestionName);
                }

            }
            if(e.action == "remove")
            {

            }

        }
    });
}
function GetListQuestionOfGroup(QuestionGroup_id)
{
    return List_DS_Question[QuestionGroup_id];

}
function detailInitEditCheckList(e) {

    var detailRow = e.detailRow;
    var QuestionGroup_id = e.data.QuestionGroup_id;

    var itm_L = detailRow.find(".left").kendoGrid({
        dataSource: GetListQuestionOfGroup(QuestionGroup_id),
        pageable: false,
        height: 300,
        columns: [
            { field:"id",title:"id",width:6 },
            { field:"name",title:"Название вопроса",width: "84%" },
            { command: [{name:"destroy",text: "Убрать", title: " ", width: "15%" }]}
        ],
        editable: true
    });

    var itm_R = detailRow.find(".right").kendoGrid({
        dataSource: DS_AllQuestions,
        pageable: false,
        height: 300,
        toolbar: [{name: "create",text: "Добавить вопрос"}],
        columns: [
            { field:"id",title:"id",width:6 },
            { field:"name",title:"Название вопроса",width: "82%" },
            { command: [
                    {name: "addd" , width: "20%", iconClass: "k-icon k-i-plus" , text: "Добавить", click: function(e){
                            e.preventDefault();
                            var tr = $(e.target).closest("tr");
                            var data = this.dataItem(tr);
                            AddQuestionToGroup(QuestionGroup_id,data.id);
                        }}
                ]}],
        editable: true
    });



}
function CeckQuestion(DS,Question_id)
{
    var result = false;
    DS.data().forEach(function (value) {
        if(value.id == Question_id)
        {
            result = true;
        }
    });
    return result;
}
function AddQuestionToGroup(QuestionGroup_id, Question_id)
{
    var DS = List_DS_Question[QuestionGroup_id];
    if(CeckQuestion(DS,Question_id))
    {
        alert("Вопрос уже есть в этой группе!");
    }
    else
    {
        $.ajax({
            url: "https://s2010/complaints/api/checklist/PostGroupContent?QuestionGroupId="+QuestionGroup_id+"&QuestionId="+Question_id+"&AnswerSchemeId=1",
            global: false,
            type: "POST",
            success: function(data) {
                if (data && data != -1) {

                    var itm = new Object();
                    itm.id = Question_id;
                    itm.name = GetNameQuestion(Question_id);
                    DS.add(itm);

                }
                else
                {
                    Exit();
                }
            }
        });


    }
}
function GetNameQuestion(Question_id)
{
    var result;
    DS_AllQuestions.fetch();
    DS_AllQuestions.data().forEach(function (item) {

        if(item.id == Question_id)
        {
            result = item.name;
        }

    });
    return result;
}



