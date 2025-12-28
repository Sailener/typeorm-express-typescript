import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { ErrorValidation } from '../../../utils/response/custom-error/types';

export const validatorCreateClient = (req: Request, res: Response, next: NextFunction) => {
  let { userId, balance, address } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  userId = !userId ? '' : String(userId);
  balance = !balance ? '' : String(balance);
  address = !address ? '' : address;
  if (validator.isEmpty(userId)) {
    errorsValidation.push({ userId: 'User ID is required' });
  } else if (!validator.isInt(userId)) {
    errorsValidation.push({ userId: 'User ID must be an integer' });
  }
  if (validator.isEmpty(balance)) {
    errorsValidation.push({ balance: 'Balance is required' });
  } else if (!validator.isFloat(balance)) {
    errorsValidation.push({ balance: 'Balance must be a number' });
  }

  if (validator.isEmpty(address)) {
    errorsValidation.push({ address: 'Address is required' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create client validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
