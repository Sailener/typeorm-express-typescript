import { Request, Response, NextFunction } from 'express';

import { UserResponseDTO } from '../../dto/UserResponseDTO'; // DTO для юзера
import { UserService } from '../../services/UserService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new UserService();
    const users = await service.list();
    res.customSuccess(
      200,
      'List of users.',
      users.map((u) => new UserResponseDTO(u)),
    );
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
