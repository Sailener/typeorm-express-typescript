import { Request, Response, NextFunction } from 'express';

import { DeviceResponseDTO } from '../../dto/DeviceResponseDTO';
import { DeviceService } from '../../services/DeviceService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new DeviceService();
    const device = await service.update(Number(req.params.id), req.body);
    res.customSuccess(200, 'Device updated.', new DeviceResponseDTO(device));
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
