import { Request, Response, NextFunction } from 'express';

import { DeviceResponseDTO } from '../../dto/DeviceResponseDTO';
import { DeviceService } from '../../services/DeviceService';
import { CustomError } from '../../utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = new DeviceService();
    const devices = await service.list();
    res.customSuccess(
      200,
      'List of devices.',
      devices.map((d) => new DeviceResponseDTO(d)),
    );
  } catch (err) {
    if (err instanceof CustomError) return next(err);
    return next(new CustomError(400, 'Raw', 'Error', null, err));
  }
};
