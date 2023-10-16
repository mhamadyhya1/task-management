import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import * as TaskService from './task.service';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';

export const createTask = catchAsync(async (req: Request, res: Response) => {
  const Task = await TaskService.createTask(req.body);
  res.status(httpStatus.CREATED).send(Task);
});

export const updateTask = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['taskId'] === 'string') {
    const Task = await TaskService.updateTaskById(
      new mongoose.Types.ObjectId(req.params['taskId']),
      req.body,
      req.user
    );
    res.status(httpStatus.OK).send(Task);
  }
});

export const getTask = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['taskId'] === 'string') {
    const Task = await TaskService.getTaskById(new mongoose.Types.ObjectId(req.params['taskId']), req.user);
    res.status(httpStatus.OK).send(Task);
  }
});

export const getTasks = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title', 'priority', 'status']);
  const options: IOptions = pick(req.query, ['limit', 'page']);
  const result = await TaskService.queryTasks(filter, options,req.user);
  res.status(httpStatus.OK).send(result);
});

export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['taskId'] === 'string') {
    await TaskService.deleteTaskById(new mongoose.Types.ObjectId(req.params['taskId']), req.user);
    res.status(httpStatus.NO_CONTENT).send();
  }
});