"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCode = exports.verifyPassword = exports.hashPassword = exports.verifyString = exports.hashString = void 0;
const crypto_1 = require("crypto");
const configs_1 = __importDefault(require("../constants/configs"));
function hashString(content, algorithm = "sha256") {
    return (0, crypto_1.createHash)(algorithm).update(content).digest("hex");
}
exports.hashString = hashString;
function verifyString(content, hash, algorithm = "sha256") {
    return hashString(content, algorithm) === hash;
}
exports.verifyString = verifyString;
function hashPassword(password) {
    return hashString(password + configs_1.default.PASSWORD_SECRET_KEY);
}
exports.hashPassword = hashPassword;
function verifyPassword(password, hash) {
    return hashPassword(password) === hash;
}
exports.verifyPassword = verifyPassword;
// Generate 6 number code
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
exports.generateCode = generateCode;
