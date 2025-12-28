import { Request, Response, NextFunction } from 'express';

import { UserResponseDTO } from '../../dto/UserResponseDTO';
import { UserService } from '../../services/UserService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new UserService();
    const user = await service.findOne(Number(req.params.id));
    res.customSuccess(200, 'User found', new UserResponseDTO(user));
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
