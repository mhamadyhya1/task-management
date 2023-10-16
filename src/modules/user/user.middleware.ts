import { NextFunction, Request , Response } from 'express';
import { ApiError } from '../errors';
import httpStatus from 'http-status';

export const addUserIdToParams = (req: Request, _res: Response, next: NextFunction) => {
  if(req.user.id===req.params['userId']){
    next();
  }
  else{
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden , for authenticated users only');
  }
};
