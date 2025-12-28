import { Request, Response, NextFunction } from 'express';

import { UserService } from '../../services/UserService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const userService = new UserService();
  try {
    await userService.delete(Number(req.params.id));
    res.customSuccess(200, 'User successfully deleted.', { id: req.params.id });
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
