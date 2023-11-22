"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const express_validator_1 = require("express-validator");
const typedi_1 = require("typedi");
const validation_1 = require("../utils/validation");
const params_validation_1 = require("../validations/params_validation");
let UserValidation = class UserValidation {
    updateProfileValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        phone: params_validation_1.ParamsValidation.phone,
        address: params_validation_1.ParamsValidation.address,
        dob: params_validation_1.ParamsValidation.date,
        first_name: params_validation_1.ParamsValidation.name,
        last_name: params_validation_1.ParamsValidation.name,
        gender: params_validation_1.ParamsValidation.gender,
    }));
    getUserProfileValidation = (0, validation_1.validate)((0, express_validator_1.checkSchema)({
        id: params_validation_1.ParamsValidation.uuid,
    }));
};
exports.UserValidation = UserValidation;
exports.UserValidation = UserValidation = __decorate([
    (0, typedi_1.Service)()
], UserValidation);
