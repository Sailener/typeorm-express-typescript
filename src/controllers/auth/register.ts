import { Request, Response, NextFunction } from 'express';

import { AuthService } from '../../services/AuthService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const authService = new AuthService();
  try {
    await authService.register(req.body);
    res.customSuccess(200, 'User successfully created.');
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
