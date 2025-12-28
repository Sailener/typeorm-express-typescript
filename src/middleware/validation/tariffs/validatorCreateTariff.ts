import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { ErrorValidation } from '../../../utils/response/custom-error/types';

export const validatorCreateTariff = (req: Request, res: Response, next: NextFunction) => {
  let { name, price, speed } = req.body;
  const errorsValidation: ErrorValidation[] = [];
  name = !name ? '' : name;
  price = !price ? '' : String(price);
  speed = !speed ? '' : String(speed);
  if (validator.isEmpty(name)) {
    errorsValidation.push({ name: 'Name is required' });
  }
  if (validator.isEmpty(price)) {
    errorsValidation.push({ price: 'Price is required' });
  } else if (!validator.isFloat(price, { gt: 0 })) {
    errorsValidation.push({ price: 'Price must be greater than 0' });
  }
  if (validator.isEmpty(speed)) {
    errorsValidation.push({ speed: 'Speed is required' });
  } else if (!validator.isInt(speed, { gt: 0 })) {
    errorsValidation.push({ speed: 'Speed must be a positive integer' });
  }
  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create tariff validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
