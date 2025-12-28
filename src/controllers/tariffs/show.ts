import { Request, Response, NextFunction } from 'express';

import { TariffResponseDTO } from '../../dto/TariffResponseDTO';
import { TariffService } from '../../services/TariffService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new TariffService();
    const tariff = await service.findOne(Number(req.params.id));
    res.customSuccess(200, 'Tariff found.', new TariffResponseDTO(tariff));
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
