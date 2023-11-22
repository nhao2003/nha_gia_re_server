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
const typeorm_1 = require("typeorm");
const database_constants_1 = require("../constants/database_constants");
const Conversation_1 = __importDefault(require("./Conversation"));
const Participant_1 = __importDefault(require("./Participant"));
const enum_1 = require("../../../constants/enum");
let Message = class Message extends typeorm_1.BaseEntity {
    id;
    conversation_id;
    sender_id;
    content_type;
    content;
    sent_at;
    is_active;
    conversation;
    sender;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], Message.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], Message.prototype, "conversation_id", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], Message.prototype, "sender_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50, enum: Object.values(enum_1.MessageTypes) }),
    __metadata("design:type", String)
], Message.prototype, "content_type", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], Message.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone }),
    __metadata("design:type", Date)
], Message.prototype, "sent_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: 'true' }),
    __metadata("design:type", Boolean)
], Message.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Conversation_1.default, conversation => conversation.messages),
    (0, typeorm_1.JoinColumn)({ name: 'conversation_id' }),
    __metadata("design:type", Conversation_1.default)
], Message.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Participant_1.default, participant => participant.messages),
    (0, typeorm_1.JoinColumn)({ name: 'sender_id' }),
    __metadata("design:type", Participant_1.default)
], Message.prototype, "sender", void 0);
Message = __decorate([
    (0, typeorm_1.Entity)('messages')
], Message);
exports.default = Message;
