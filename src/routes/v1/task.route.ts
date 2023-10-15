import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { taskController, taskValidation } from '../../modules/task';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('create_task'), validate(taskValidation.createTask), taskController.createTask)
  .get(auth('get_tasks'), validate(taskValidation.getTasks), taskController.getTasks);

router
  .route('/:taskId')
  .get(auth('get_task'), validate(taskValidation.getTask), taskController.getTask)
  .patch(auth('update_task'), validate(taskValidation.updateTask), taskController.updateTask)
  .delete(auth('delete_task'), validate(taskValidation.deleteTask), taskController.deleteTask);

export default router;
