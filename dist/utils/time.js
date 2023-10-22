"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeToMilliseconds = void 0;
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const Error_1 = require("../models/Error");
function parseTimeToMilliseconds(timeString) {
    const match = timeString.match(/^(\d+)([smhdMy])$/i);
    if (!match) {
        throw new Error("Invalid time string");
    }
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    // Chuyển đổi thành miliseconds dựa vào đơn vị
    switch (unit) {
        case "s":
            return value * 1000; // Giây
        case "m":
            return value * 60 * 1000; // Phút
        case "h":
            return value * 60 * 60 * 1000; // Giờ
        case "d":
            return value * 24 * 60 * 60 * 1000; // Ngày
        case "mo":
            return value * 30 * 24 * 60 * 60 * 1000; // Tháng (ước tính)
        case "y":
            return value * 365 * 24 * 60 * 60 * 1000; // Năm (ước tính)
        default:
            throw new Error_1.AppError("Invalid time unit", httpStatus_1.default.INTERNAL_SERVER_ERROR);
    }
}
exports.parseTimeToMilliseconds = parseTimeToMilliseconds;
