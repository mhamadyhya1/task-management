import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { userController, userValidation } from '../../modules/user';
import { addUserIdToParams } from '../../modules/user/user.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('create_user'), validate(userValidation.createUser), userController.createUser)
  .get(auth('get_users'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .patch(auth('update_user'),addUserIdToParams,validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('delete_user'),addUserIdToParams,validate(userValidation.deleteUser), userController.deleteUser);

export default router;
