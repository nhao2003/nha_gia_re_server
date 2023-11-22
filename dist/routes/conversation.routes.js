"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversation_controller_1 = __importDefault(require("../controllers/conversation.controller"));
const di_1 = __importDefault(require("../di/di"));
const router = (0, express_1.Router)();
const conversationController = di_1.default.get(conversation_controller_1.default);
router.post("/", conversationController.getOrCreateConversation);
router.delete("/", conversationController.deleteConversation);
router.get("/", conversationController.getConversations);
router.get("/id", conversationController.getConversationById);
router.post("/message", conversationController.sendMessage);
exports.default = router;
