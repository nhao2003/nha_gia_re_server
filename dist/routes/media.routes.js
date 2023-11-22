"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media_controller_1 = __importDefault(require("../controllers/media.controller"));
const di_1 = __importDefault(require("../di/di"));
const routes = (0, express_1.Router)();
const mediaController = di_1.default.get(media_controller_1.default);
routes.post('/upload', mediaController.upload);
exports.default = routes;
