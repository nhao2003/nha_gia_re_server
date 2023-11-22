"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = __importDefault(require("../controllers/report.controller"));
const di_1 = __importDefault(require("../di/di"));
const router = (0, express_1.Router)();
const reportController = di_1.default.get(report_controller_1.default);
router.route('/').get(reportController.getAllReport);
exports.default = router;
