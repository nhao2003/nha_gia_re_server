"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conversation_service_1 = __importDefault(require("../services/conversation.service"));
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const typedi_1 = require("typedi");
let ConversationController = class ConversationController {
    conversationService;
    constructor(conversationService) {
        this.conversationService = conversationService;
    }
    getOrCreateConversation = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { user_id, other_user_id } = req.body;
        const conversation = await this.conversationService.getOrCreateConversation(user_id, other_user_id);
        const appResponse = {
            status: 'success',
            code: 200,
            message: 'Get or create conversation successfully',
            result: conversation,
        };
        res.status(200).json(appResponse);
    });
    getConversations = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { user_id } = req.body;
        const conversations = await this.conversationService.getConversations(user_id);
        const appResponse = {
            status: 'success',
            code: 200,
            message: 'Get conversations successfully',
            result: conversations,
        };
        res.status(200).json(appResponse);
    });
    deleteConversation = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { user_id, other_user_id } = req.body;
        const conversation = await this.conversationService.deleteConversation(user_id, other_user_id);
        const appResponse = {
            status: 'success',
            code: 200,
            message: 'Delete conversation successfully',
            result: conversation,
        };
        res.status(200).json(appResponse);
    });
    getConversationById = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { conversation_id } = req.body;
        const conversation = await this.conversationService.getConversationById(conversation_id);
        const appResponse = {
            status: 'success',
            code: 200,
            message: 'Get conversation by id successfully',
            result: conversation,
        };
        res.status(200).json(appResponse);
    });
    getConversationByUserIdAndConversationId = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
    });
    sendMessage = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { user_id, conversation_id, content } = req.body;
        const message = await this.conversationService.sendMessage(conversation_id, user_id, content);
        const appResponse = {
            status: 'success',
            code: 200,
            message: 'Send message successfully',
            result: message,
        };
        res.status(200).json(appResponse);
    });
};
ConversationController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [conversation_service_1.default])
], ConversationController);
exports.default = ConversationController;
