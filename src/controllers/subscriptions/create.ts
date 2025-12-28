import { Request, Response, NextFunction } from 'express';

import { SubscriptionResponseDTO } from '../../dto/SubscriptionResponseDTO';
import { SubscriptionService } from '../../services/SubscriptionService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new SubscriptionService();
    const sub = await service.create(req.body);
    res.customSuccess(201, 'Subscription created.', new SubscriptionResponseDTO(sub));
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
