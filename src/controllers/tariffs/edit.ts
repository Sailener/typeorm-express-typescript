import { Request, Response, NextFunction } from 'express';

import { TariffResponseDTO } from '../../dto/TariffResponseDTO';
import { TariffService } from '../../services/TariffService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new TariffService();
    const tariff = await service.update(Number(req.params.id), req.body);
    res.customSuccess(200, 'Tariff updated.', new TariffResponseDTO(tariff));
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
