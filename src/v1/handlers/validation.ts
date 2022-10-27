
import express, { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { CustomRequest } from '../../types/request';

export const validate = <T>(req: CustomRequest<T>, res: express.Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  next();
};