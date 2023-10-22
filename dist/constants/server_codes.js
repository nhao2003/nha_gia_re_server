"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerCodes = {
    ValidationCode: 50,
    AuthCode: {
        Success: 100,
        InvalidCredentials: 101,
        UserNotFound: 102,
        EMAIL_ALREADY_EXISTS: 103,
        UserNotActive: 104,
        UserNotUpdateProfile: 105,
    },
};
exports.default = ServerCodes;