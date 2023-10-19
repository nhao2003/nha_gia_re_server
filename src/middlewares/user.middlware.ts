import { checkSchema } from "express-validator";
import { check } from "prettier/standalone.js";
import { validate } from "~/utils/validation";
import { ParamsValidation } from "~/validations/params_validation";

export class UserValidation {
    public static readonly updateProfileValidation = validate(
        checkSchema({
            phone: ParamsValidation.phone,
            address: ParamsValidation.address,
            dob: ParamsValidation.date,
            first_name: ParamsValidation.name,
            last_name: ParamsValidation.name,
            gender: ParamsValidation.gender,
        })
    )
}