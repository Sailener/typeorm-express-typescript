import { Request, Response, NextFunction } from 'express';

import { ClientResponseDTO } from '../../dto/ClientResponseDTO';
import { ClientService } from '../../services/ClientService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new ClientService();
    const clients = await service.list();
    res.customSuccess(
      200,
      'List of clients.',
      clients.map((c) => new ClientResponseDTO(c)),
    );
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
