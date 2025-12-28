import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { ErrorValidation } from '../../../utils/response/custom-error/types';

export const validatorCreateDevice = (req: Request, res: Response, next: NextFunction) => {
  let { model, ip_address, mac_address, typeId, statusId } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  model = !model ? '' : model;
  ip_address = !ip_address ? '' : ip_address;
  mac_address = !mac_address ? '' : mac_address;
  typeId = !typeId ? '' : String(typeId);
  statusId = !statusId ? '' : String(statusId);

  // 1. Модель
  if (validator.isEmpty(model)) {
    errorsValidation.push({ model: 'Model is required' });
  }

  // 2. IP-адрес (используем встроенную проверку isIP)
  if (validator.isEmpty(ip_address)) {
    errorsValidation.push({ ip_address: 'IP address is required' });
  } else if (!validator.isIP(ip_address)) {
    errorsValidation.push({ ip_address: 'Invalid IP address format' });
  }

  // 3. MAC-адрес (isMACAddress)
  if (validator.isEmpty(mac_address)) {
    errorsValidation.push({ mac_address: 'MAC address is required' });
  } else if (!validator.isMACAddress(mac_address)) {
    errorsValidation.push({ mac_address: 'Invalid MAC address format' });
  }

  // 4. Справочники
  if (validator.isEmpty(typeId) || !validator.isInt(typeId)) {
    errorsValidation.push({ typeId: 'Device Type ID is required and must be integer' });
  }
  if (validator.isEmpty(statusId) || !validator.isInt(statusId)) {
    errorsValidation.push({ statusId: 'Device Status ID is required and must be integer' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create device validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
