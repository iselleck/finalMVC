let taskRenderer;
let taskForm;
let TaskFormClass;
let TaskListClass;

const handleTask = (e) => {
    e.preventDefault();
    
    if($("#dueDate").val() == '' || $("#aTask").val() == '') {
        handleError("Both a task and due date are required");
        return false;
    }
    
    sendAjax('POST', $("#taskForm").attr("action"), $("#taskForm").serialize(), function() {
        taskRenderer.loadTasksFromServer();
    });

    return false;
};

const renderTask = function() {
    return (
        <form id="taskForm"
              onSubmit={this.handleSubmit}
              name="taskForm"
              action="/maker"
              method="POST"
              className="taskForm"
        >
        <label htmlFor="duedate">Date: </label>
        <input id="dueDate" type="text" name="duedate" placeholder="Complete date"/>
        <label htmlFor="task">Task: </label>
        <input id="aTask" type="text" name="task" placeholder="Enter Task" />
        
        
        <input type="hidden" name="_csrf" value={this.props.csrf} />
        <input className="makeTaskSubmit" type="submit" value="Add Task" />    
        </form>
    );
};

const renderTaskList = function() {

    if(this.state.data.length === 0) {
        return (
            <div className="taskList">
              <h3 className="emptyTask">No tasks. Add some above</h3>
            </div>
        );
    }
    
  
    
    const taskNodes = this.state.data.map(function(tasked) {
        console.log(tasked);
        return (
            <div key={tasked._id} className="tasked">
            <h3 className="dueDate">Due: {tasked.duedate} </h3>
               <h3 className="aTask">Task:  </h3>
            <p> {tasked.task} </p>
            </div>
        );
    });
 
    
    return (
        <div className="taskList">
            {taskNodes}
        </div>
    );
        
};

const setup = function(csrf) {
    TaskFormClass = React.createClass({
        handleSubmit: handleTask,
        render: renderTask,
    });
    
    TaskListClass = React.createClass({
        loadTasksFromServer: function() {
            sendAjax('GET', '/getTasks', null, function(data) {
                this.setState({data:data.task});
            }.bind(this));
        },
        
        getInitialState: function() {
            return {data: []};
        },
        
        componentDidMount: function() {
            this.loadTasksFromServer();
        },
        render: renderTaskList
    });
    
    taskForm = ReactDOM.render(
        <TaskFormClass csrf={csrf} />, document.querySelector("#makeTask")
    );
    
     taskRenderer = ReactDOM.render(
        <TaskListClass />, document.querySelector("#tasks")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});