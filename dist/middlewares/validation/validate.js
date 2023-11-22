"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate = (schema) => async (req, res, next) => {
    try {
        const data = req.body;
        await schema.validate(data);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = validate;
