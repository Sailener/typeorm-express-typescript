import { Request, Response, NextFunction } from 'express';

import { AuthService } from '../../services/AuthService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  const authService = new AuthService();
  const { id } = req.jwtPayload; // ID из токена
  try {
    await authService.changePassword(id, req.body);
    res.customSuccess(200, 'Password successfully changed.');
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
