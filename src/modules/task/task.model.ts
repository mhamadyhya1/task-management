import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ITaskDoc, ITaskModel, TaskPriority, TaskStatus } from './task.interface';

const TaskSchema = new mongoose.Schema<ITaskDoc, ITaskModel>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description:{
      type: String,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate:{
      type: Date,
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum:TaskStatus,
      default:TaskStatus.To_Do,
    },
    priority: {
      type: String,
      enum: TaskPriority,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// add plugin that converts mongoose to json
TaskSchema.plugin(toJSON);
TaskSchema.plugin(paginate);

const Task = mongoose.model<ITaskDoc, ITaskModel>('Task', TaskSchema);

export default Task;
