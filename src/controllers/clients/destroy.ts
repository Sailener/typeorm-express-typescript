import { Request, Response, NextFunction } from 'express';

import { ClientService } from '../../services/ClientService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new ClientService();
    await service.delete(Number(req.params.id));
    res.customSuccess(200, 'Client deleted.', { id: req.params.id });
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
