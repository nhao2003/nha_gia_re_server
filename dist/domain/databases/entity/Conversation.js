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
const Participant_1 = __importDefault(require("./Participant"));
const Message_1 = __importDefault(require("./Message"));
let Conversation = class Conversation extends typeorm_1.BaseEntity {
    id;
    created_at;
    last_messsage_id;
    is_active;
    participants;
    messages;
    users = null;
    last_message = null;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], Conversation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: database_constants_1.PostgresDataType.date }),
    __metadata("design:type", Date)
], Conversation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.uuid, nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "last_messsage_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: 'true' }),
    __metadata("design:type", Boolean)
], Conversation.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Participant_1.default, participant => participant.conversation, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id' }),
    __metadata("design:type", Array)
], Conversation.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Message_1.default, message => message.conversation, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id' }),
    __metadata("design:type", Array)
], Conversation.prototype, "messages", void 0);
Conversation = __decorate([
    (0, typeorm_1.Entity)('conversations')
], Conversation);
exports.default = Conversation;
