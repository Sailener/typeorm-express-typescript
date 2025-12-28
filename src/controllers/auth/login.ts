import { Request, Response, NextFunction } from 'express';

import { AuthService } from '../../services/AuthService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const authService = new AuthService();
  try {
    const token = await authService.login(req.body);
    res.customSuccess(200, 'Token successfully created.', `Bearer ${token}`);
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
