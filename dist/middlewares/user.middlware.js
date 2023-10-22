"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const express_validator_1 = require("express-validator");
const validation_1 = require("../utils/validation");
const params_validation_1 = require("../validations/params_validation");
class UserValidation {
    static updateProfileValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        phone: params_validation_1.ParamsValidation.phone,
        address: params_validation_1.ParamsValidation.address,
        dob: params_validation_1.ParamsValidation.date,
        first_name: params_validation_1.ParamsValidation.name,
        last_name: params_validation_1.ParamsValidation.name,
        gender: params_validation_1.ParamsValidation.gender
    }));
    static getUserProfileValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        id: params_validation_1.ParamsValidation.uuid,
    }));
}
exports.UserValidation = UserValidation;
