import { checkSchema } from 'express-validator';
import { check } from 'prettier/standalone.js';
import { Service } from 'typedi';
import { validate } from '~/utils/validation';
import { ParamsValidation } from '~/validations/params_validation';

@Service()
export class UserValidation {
  public readonly updateProfileValidation = validate(
    checkSchema({
      phone: ParamsValidation.phone,
      address: ParamsValidation.address,
      dob: ParamsValidation.date,
      first_name: ParamsValidation.name,
      last_name: ParamsValidation.name,
      gender: ParamsValidation.gender,
    }),
  );

  public readonly getUserProfileValidation = validate(
    checkSchema({
      id: ParamsValidation.uuid,
    }),
  );
}
