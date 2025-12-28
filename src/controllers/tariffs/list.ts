import { Request, Response, NextFunction } from 'express';

import { TariffResponseDTO } from '../../dto/TariffResponseDTO';
import { TariffService } from '../../services/TariffService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new TariffService();
    const tariffs = await service.list();
    res.customSuccess(
      200,
      'List of tariffs.',
      tariffs.map((t) => new TariffResponseDTO(t)),
    );
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
