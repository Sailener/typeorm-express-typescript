import { Request, Response, NextFunction } from 'express';

import { UserResponseDTO } from '../../dto/UserResponseDTO';
import { UserService } from '../../services/UserService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new UserService();
    const user = await service.update(Number(req.params.id), req.body);
    res.customSuccess(200, 'User updated.', new UserResponseDTO(user));
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
