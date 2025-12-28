import { Request, Response, NextFunction } from 'express';

import { DeviceResponseDTO } from '../../dto/DeviceResponseDTO';
import { DeviceService } from '../../services/DeviceService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new DeviceService();
    const device = await service.create(req.body);
    res.customSuccess(201, 'Device created.', new DeviceResponseDTO(device));
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
