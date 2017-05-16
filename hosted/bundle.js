"use strict";

var taskRenderer = void 0;
var taskForm = void 0;
var TaskFormClass = void 0;
var TaskListClass = void 0;

var handleTask = function handleTask(e) {
    e.preventDefault();

    if ($("#dueDate").val() == '' || $("#aTask").val() == '') {
        handleError("Both a task and due date are required");
        return false;
    }

    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function () {
        taskRenderer.loadTasksFromServer();
    });

    return false;
};

var renderTask = function renderTask() {
    return React.createElement(
        "form",
        { id: "taskForm",
            onSubmit: this.handleSubmit,
            name: "taskForm",
            action: "/maker",
            method: "POST",
            className: "taskForm"
        },
        React.createElement(
            "label",
            { htmlFor: "duedate" },
            "Date: "
        ),
        React.createElement("input", { id: "dueDate", type: "text", name: "duedate", placeholder: "Complete date" }),
        React.createElement(
            "label",
            { htmlFor: "task" },
            "Task: "
        ),
        React.createElement("input", { id: "aTask", type: "text", name: "task", placeholder: "Enter Task" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
        React.createElement("input", { className: "makeTaskSubmit", type: "submit", value: "Add Task" })
    );
};

var renderTaskList = function renderTaskList() {

    if (this.state.data.length === 0) {
        return React.createElement(
            "div",
            { className: "taskList" },
            React.createElement(
                "h3",
                { className: "emptyTask" },
                "No tasks. Add some above"
            )
        );
    }

    var taskNodes = this.state.data.map(function (tasked) {
        console.log(tasked);
        return React.createElement(
            "div",
            { key: tasked._id, className: "tasked" },
            React.createElement(
                "h3",
                { className: "dueDate" },
                "Due: ",
                tasked.duedate,
                " "
            ),
            React.createElement(
                "h3",
                { className: "aTask" },
                "Task:  "
            ),
            React.createElement(
                "p",
                null,
                " ",
                tasked.task,
                " "
            )
        );
    });

    return React.createElement(
        "div",
        { className: "taskList" },
        taskNodes
    );
};

var setup = function setup(csrf) {
    TaskFormClass = React.createClass({
        displayName: "TaskFormClass",

        handleSubmit: handleTask,
        render: renderTask
    });

    TaskListClass = React.createClass({
        displayName: "TaskListClass",

        loadTasksFromServer: function loadTasksFromServer() {
            sendAjax('GET', '/getTasks', null, function (data) {
                this.setState({ data: data.task });
            }.bind(this));
        },

        getInitialState: function getInitialState() {
            return { data: [] };
        },

        componentDidMount: function componentDidMount() {
            this.loadTasksFromServer();
        },
        render: renderTaskList
    });

    taskForm = ReactDOM.render(React.createElement(TaskFormClass, { csrf: csrf }), document.querySelector("#makeTask"));

    taskRenderer = ReactDOM.render(React.createElement(TaskListClass, null), document.querySelector("#tasks"));
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
