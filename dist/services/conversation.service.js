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
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const Participant_1 = __importDefault(require("../domain/databases/entity/Participant"));
const Message_1 = __importDefault(require("../domain/databases/entity/Message"));
const Conversation_1 = __importDefault(require("../domain/databases/entity/Conversation"));
const enum_1 = require("../constants/enum");
const User_1 = require("../domain/databases/entity/User");
let ConversationService = class ConversationService {
    conversationRepository;
    messageRepository;
    participantRepository;
    constructor(dataSource) {
        this.conversationRepository = dataSource.getRepository(Conversation_1.default);
        this.messageRepository = dataSource.getRepository(Message_1.default);
        this.participantRepository = dataSource.getRepository(Participant_1.default);
    }
    createConversation = async (user_id, other_user_id) => {
        const conversation = await this.conversationRepository.save(new Conversation_1.default());
        const participant = new Participant_1.default();
        participant.user_id = user_id;
        participant.conversation_id = conversation.id;
        const otherParticipant = new Participant_1.default();
        otherParticipant.user_id = other_user_id;
        otherParticipant.conversation_id = conversation.id;
        conversation.participants = [participant, otherParticipant];
        const res = await this.conversationRepository.save(conversation);
        return this.getConversationById(res.id);
    };
    async getConversationByUserIdAndOtherUserId(user_id, other_user_id) {
        const conversation = await this.conversationRepository
            .createQueryBuilder('conversation')
            .innerJoinAndSelect('conversation.participants', 'participant')
            .leftJoinAndSelect('conversation.messages', 'message')
            .leftJoinAndMapMany('conversation.users', User_1.User, 'user', 'user.id = participant.user_id')
            .where('conversation.id IN (SELECT A.conversation_id FROM participants A JOIN participants B ON A.conversation_id = B.conversation_id WHERE A.user_id = :user_id AND B.user_id = :other_user_id)', {
            user_id,
            other_user_id,
        })
            .getOne();
        return conversation;
    }
    async getConversationByUserIdAndConversationId(user_id, conversation_id) {
        const conversation = await this.conversationRepository
            .createQueryBuilder('conversation')
            .innerJoinAndSelect('conversation.participants', 'participant')
            .leftJoinAndSelect('conversation.messages', 'message')
            .leftJoinAndMapMany('conversation.users', User_1.User, 'user', 'user.id = participant.user_id')
            .where('participant.user_id = :user_id', { user_id })
            .andWhere('conversation.id = :conversation_id', { conversation_id })
            .getOne();
        return conversation;
    }
    async getConversations(user_id) {
        const conversations = await this.conversationRepository
            .createQueryBuilder('conversation')
            .where('conversation.id IN (SELECT conversation_id FROM participants WHERE user_id = :user_id)', { user_id })
            .leftJoinAndSelect('conversation.participants', 'participant')
            .leftJoinAndMapOne('conversation.last_message', Message_1.default, 'message', 'message.id = conversation.last_messsage_id')
            .leftJoinAndMapMany('conversation.users', User_1.User, 'user', 'user.id = participant.user_id')
            .getMany();
        return conversations;
    }
    async getOrCreateConversation(user_id, other_user_id) {
        let isExist = true;
        let conversation = await this.getConversationByUserIdAndOtherUserId(user_id, other_user_id);
        if (!conversation) {
            conversation = await this.createConversation(user_id, other_user_id);
            isExist = false;
        }
        return {
            conversation,
            isExist,
        };
    }
    async deleteConversation(user_id, other_user_id) {
        const conversation = await this.getConversationByUserIdAndOtherUserId(user_id, other_user_id);
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        await this.messageRepository.delete({ conversation_id: conversation.id });
        await this.participantRepository.delete({ conversation_id: conversation.id });
        await this.conversationRepository.delete({ id: conversation.id });
        return conversation;
    }
    async getConversationById(conversation_id) {
        const conversation = await this.conversationRepository
            .createQueryBuilder()
            .leftJoinAndSelect('Conversation.participants', 'participant')
            .leftJoinAndSelect('Conversation.messages', 'message')
            .leftJoinAndMapMany('Conversation.users', User_1.User, 'user', 'user.id = participant.user_id')
            .where('Conversation.id = :conversation_id', { conversation_id })
            .getOne();
        return conversation;
    }
    sendMessage = async (conversation_id, user_id, content) => {
        const message = new Message_1.default();
        message.conversation_id = conversation_id;
        message.content_type = enum_1.MessageTypes.text;
        message.sender_id = user_id;
        message.content = {
            text: content,
        };
        return await this.messageRepository.save(message);
    };
    async getMessages(conversation_id) {
        const messages = await this.messageRepository
            .createQueryBuilder('message')
            .where('message.conversation_id = :conversation_id', { conversation_id })
            .orderBy('message.sent_at', 'DESC')
            .getMany();
        return messages;
    }
};
ConversationService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ConversationService);
exports.default = ConversationService;
