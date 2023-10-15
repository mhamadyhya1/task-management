import mongoose, { Model, Document, SchemaTimestampsConfig, Types } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface ITask {
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: Types.ObjectId;
  assignee:Types.ObjectId;
}

export interface ITaskDoc extends ITask, Document, SchemaTimestampsConfig {}

export interface ITaskModel extends Model<ITaskDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
  isTitleTaken(title: string, excludeTaskId?: mongoose.Types.ObjectId): Promise<boolean>;
}
export enum TaskStatus {
  To_Do = 'To Do',
  IN_PROGRESS = 'In Progess',
  DONE = 'Done',
  IN_REVIEW = 'In Review',
  RECHECK = 'ReCheck',
  MOVE_TO_QA = 'Move To QA',
  CLOSED = 'Closed',
}
export enum TaskPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
};
export type UpdateTaskBody = ITask & Partial<Pick<ITask, 'title'>>;

export type NewCreatedTask = Pick<ITask, 'title' | 'assignedTo' | 'assignee' | 'dueDate'| 'priority'| 'status'> & Partial<Pick<ITask, 'description'>>;
