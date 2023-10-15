import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Task from './task.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedTask, UpdateTaskBody, ITaskDoc } from './task.interface';
import { IUserDoc } from '../user/user.interfaces';
import { User } from '../user';

/**
 * check if Task exists , if not throw not found error
 * Create a Task
 * @param {NewCreatedTask} TaskBody
 * @returns {Promise<ITaskDoc>}
 */
export const createTask = async (TaskBody: NewCreatedTask): Promise<ITaskDoc> => {
  const checkAssignedToExists = await User.findById(TaskBody.assignedTo);
  if (!checkAssignedToExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'assignedTo not found');
  } else {
    return Task.create(TaskBody);
  }
};

/**
 * Query for Tasks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryTasks = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  const updatedFilter = { ...filter };
  const Tasks = await Task.paginate(updatedFilter, options);
  return Tasks;
};

/**
 * Get Task by id
 * @param {mongoose.Types.ObjectId} id
 * @param {IUserDoc | null} user
 * @returns {Promise<ITaskDoc | null>}
 */
export const getTaskById = async (id: mongoose.Types.ObjectId, user?: IUserDoc | null): Promise<ITaskDoc | null> => {
  if (!user) return Task.findById(id);
  return user.role === 'user'
    ? Task.findOne({
        _id: id,
        user: user.id,
      })
    : Task.findOne({ _id: id });
};

/**
 * Update Task by id
 * @param {mongoose.Types.ObjectId} TaskId
 * @param {UpdateTaskBody} updateBody
 * @param {IUserDoc | null} user
 * @returns {Promise<ITaskDoc | null>}
 */
export const updateTaskById = async (
  TaskId: mongoose.Types.ObjectId,
  updateBody: UpdateTaskBody,
  user?: IUserDoc | null
): Promise<ITaskDoc | null> => {
  const Task = await getTaskById(TaskId, user);
  if (!Task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  Object.assign(Task, updateBody);
  await Task.save();
  return Task;
};

/**
 * Delete Task by id
 * subtract count number of newsletter's Task -1
 * @param {mongoose.Types.ObjectId} TaskId
 * @param {IUserDoc | null} user
 * @returns {Promise<ITaskDoc | null>}
 */
export const deleteTaskById = async (
  TaskId: mongoose.Types.ObjectId,
  user?: IUserDoc | null
): Promise<ITaskDoc | null> => {
  const Task = await getTaskById(TaskId, user);
  if (!Task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  await Task.deleteOne();
  return Task;
};

