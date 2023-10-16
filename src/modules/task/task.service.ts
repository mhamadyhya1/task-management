import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Task from './task.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedTask, UpdateTaskBody, ITaskDoc } from './task.interface';
import { IUserDoc } from '../user/user.interfaces';
import { User } from '../user';
import { redisClient } from '../utils/redisCache';

/**
 * check if Task exists , if not throw not found error
 * Create a Task
 * @param {NewCreatedTask} TaskBody
 * @returns {Promise<ITaskDoc>}
 */
export const createTask = async (TaskBody: NewCreatedTask): Promise<ITaskDoc> => {
  const checkAssignedToExists = await User.findById(TaskBody.assignedTo);
  if (!checkAssignedToExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AssignedTo not found');
  } else {
    const task =  Task.create(TaskBody);
    await redisClient.del('cached_tasks_document');
    return task;
  }
};

/**
 * Query for Tasks
 * if user is regular , query for Tasks that assigned to him or created by him
 * assignee and assignedTo are populated with name
 * apply cache to query result
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryTasks = async (
  filter: Record<string, any>,
  options: IOptions,
  user:IUserDoc
): Promise<QueryResult> => {
  let updatedFilter = { ...filter };
  if(user.role==='regular')
  {
    updatedFilter ={ ...filter,$or:[{assignee:user.id},{assignedTo:user.id}]};
  }
  const cachedData = await redisClient.get('cached_tasks_document');
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  let updatedOptions:IOptions = { ...options, populate: [{path:'assignee','select':'email'},{path:'assignedTo','select':'name'}] };
  const Tasks = await Task.paginate(updatedFilter, updatedOptions);
  await redisClient.set('cached_tasks_document', JSON.stringify(Tasks), 'EX', 3600);
  return Tasks;
};

/**
 * Get Task by id
 * @param {mongoose.Types.ObjectId} id
 * @param {IUserDoc | null} user
 * @returns {Promise<ITaskDoc | null>}
 */
export const getTaskById = async (id: mongoose.Types.ObjectId, user?: IUserDoc | null): Promise<ITaskDoc | null> => {
  if (!user) return null;
  return user.role === 'regular'
    ? Task.findOne({
        _id: id,
        $or: [{ assignee: user.id }, { assignedTo: user.id }],
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

