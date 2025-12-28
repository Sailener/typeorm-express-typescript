import { Request, Response, NextFunction } from 'express';

import { ClientResponseDTO } from '../../dto/ClientResponseDTO';
import { ClientService } from '../../services/ClientService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new ClientService();
    const client = await service.findOne(Number(req.params.id));
    res.customSuccess(200, 'Client found.', new ClientResponseDTO(client));
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
