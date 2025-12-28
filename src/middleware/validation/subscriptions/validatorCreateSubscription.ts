import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { ErrorValidation } from '../../../utils/response/custom-error/types';

export const validatorCreateSubscription = (req: Request, res: Response, next: NextFunction) => {
  let { clientId, tariffId, start_date } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  clientId = !clientId ? '' : String(clientId);
  tariffId = !tariffId ? '' : String(tariffId);
  start_date = !start_date ? '' : start_date;

  // 1. Проверка Client ID
  if (validator.isEmpty(clientId)) {
    errorsValidation.push({ clientId: 'Client ID is required' });
  } else if (!validator.isInt(clientId)) {
    errorsValidation.push({ clientId: 'Client ID must be an integer' });
  }

  // 2. Проверка Tariff ID
  if (validator.isEmpty(tariffId)) {
    errorsValidation.push({ tariffId: 'Tariff ID is required' });
  } else if (!validator.isInt(tariffId)) {
    errorsValidation.push({ tariffId: 'Tariff ID must be an integer' });
  }

  // 3. Проверка Даты (если передана)
  if (!validator.isEmpty(start_date) && !validator.isDate(start_date)) {
    errorsValidation.push({ start_date: 'Start date must be a valid date (YYYY-MM-DD)' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create subscription validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
