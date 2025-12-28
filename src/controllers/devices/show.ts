import { Request, Response, NextFunction } from 'express';

import { DeviceResponseDTO } from '../../dto/DeviceResponseDTO';
import { DeviceService } from '../../services/DeviceService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new DeviceService();
    const device = await service.findOne(Number(req.params.id));
    res.customSuccess(200, 'Device found.', new DeviceResponseDTO(device));
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
