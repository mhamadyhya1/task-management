import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedTask, TaskPriority, TaskStatus } from './task.interface';

const createTaskBody: Record<keyof NewCreatedTask, any> = {
  title: Joi.string().required(),
  assignedTo: Joi.string().custom(objectId),
  assignee: Joi.string().custom(objectId),
  dueDate: Joi.date().required(),
  priority: Joi.string().valid(...Object.values(TaskPriority)).required(),
  status: Joi.string().valid(...Object.values(TaskStatus)).required(),
  description: Joi.string(),
};

export const createTask = {
  body: Joi.object().keys(createTaskBody),
};

export const createTaskReply = {
  body: Joi.object().keys(createTaskBody),
  params: Joi.object().keys({
    taskId: Joi.required().custom(objectId),
  }),
};
export const getTasks = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
    })
    .min(1),
};

export const deleteTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId).required(),
  }),
};
export const getTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId).required(),
  }),
};