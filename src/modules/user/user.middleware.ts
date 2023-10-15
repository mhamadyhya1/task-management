import { NextFunction, Request , Response } from 'express';

export const addUserIdToParams = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    req.params['userId'] = req.user.id.toString();
  }
  next();
};
