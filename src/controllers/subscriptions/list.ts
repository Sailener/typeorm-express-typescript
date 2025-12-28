import { Request, Response, NextFunction } from 'express';

import { SubscriptionResponseDTO } from '../../dto/SubscriptionResponseDTO';
import { SubscriptionService } from '../../services/SubscriptionService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new SubscriptionService();
    const subs = await service.list();
    res.customSuccess(
      200,
      'List of subscriptions.',
      subs.map((s) => new SubscriptionResponseDTO(s)),
    );
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
