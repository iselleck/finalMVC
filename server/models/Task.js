const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let TaskModel = {};

const convertId = mongoose.Types.ObjectId;
const setTask = (task) => _.escape(task).trim();
const setDate = (duedate) => _.escape(duedate).trim();


const TaskSchema = new mongoose.Schema({
      duedate: {
        type: String,
        required: false,
          set: setDate,
    },
    task: {
        type: String,
        required: true,
        trim: true,
        set: setTask,
    },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

TaskSchema.statics.toAPI = (doc) => ({
    duedate: doc.duedate,
    task: doc.task,
});

TaskSchema.statics.findByOwner = (ownerId, callback) => {
    const search = {
        owner: convertId(ownerId),
    };
    
    return TaskModel.find(search).select('duedate task').exec(callback);
};

TaskModel = mongoose.model('Task', TaskSchema);

module.exports.TaskModel = TaskModel;
module.exports.TaskSchema = TaskSchema;