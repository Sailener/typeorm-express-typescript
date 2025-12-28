import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../../../orm/entities/users/User';
import { CustomError } from '../../../utils/response/custom-error/CustomError';
import { ErrorValidation } from '../../../utils/response/custom-error/types';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  const { email, tel_number } = req.body;
  const errorsValidation: ErrorValidation[] = [];
  const userRepository = getRepository(User);

  if (email) {
    const user = await userRepository.findOne({ where: { email } });
    if (user && user.id !== Number(req.params.id)) {
      errorsValidation.push({ email: `Email '${email}' already exists` });
    }
  }

  if (tel_number) {
    const user = await userRepository.findOne({ where: { tel_number } });
    if (user && user.id !== Number(req.params.id)) {
      errorsValidation.push({ tel_number: `Phone '${tel_number}' already exists` });
    }
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Edit user validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
