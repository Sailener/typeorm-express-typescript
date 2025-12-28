import { Request, Response, NextFunction } from 'express';

import { TariffResponseDTO } from '../../dto/TariffResponseDTO'; // <--- Импорт DTO
import { TariffService } from '../../services/TariffService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new TariffService();
    const tariff = await service.create(req.body);
    res.customSuccess(201, 'Tariff created.', new TariffResponseDTO(tariff));
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
