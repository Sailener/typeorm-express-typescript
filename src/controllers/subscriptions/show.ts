import { Request, Response, NextFunction } from 'express';

import { SubscriptionResponseDTO } from '../../dto/SubscriptionResponseDTO';
import { SubscriptionService } from '../../services/SubscriptionService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new SubscriptionService();
    const sub = await service.findOne(Number(req.params.id));
    res.customSuccess(200, 'Subscription found.', new SubscriptionResponseDTO(sub));
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
