import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { auth } from '../../modules/auth';
import { userController, userValidation } from '../../modules/user';
import { addUserIdToParams } from '../../modules/user/user.middleware';

const router: Router = express.Router();

router
  .route('/')
  .post(auth('create_user'), validate(userValidation.createUser), userController.createUser)

router
  .route('/:userId')
  .get(auth('get_user'),addUserIdToParams,validate(userValidation.getUser), userController.getUser)
  .patch(auth('update_user'),addUserIdToParams,validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('delete_user'),addUserIdToParams,validate(userValidation.deleteUser), userController.deleteUser);

export default router;
