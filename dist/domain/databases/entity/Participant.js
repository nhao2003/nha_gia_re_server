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
const Message_1 = __importDefault(require("./Message"));
let Participant = class Participant {
    conversation_id;
    user_id;
    joined_at;
    read_last_message_at;
    is_active;
    conversation;
    messages;
};
__decorate([
    (0, typeorm_1.Column)({ primary: true, type: database_constants_1.PostgresDataType.uuid, comment: 'This is the Conversation ID.' }),
    __metadata("design:type", String)
], Participant.prototype, "conversation_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ primary: true, type: database_constants_1.PostgresDataType.uuid, comment: 'This is the User ID.' }),
    __metadata("design:type", String)
], Participant.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone, default: database_constants_1.DatabaseDefaultValues.now, comment: 'This is the timestamp of the participant.' }),
    __metadata("design:type", Date)
], Participant.prototype, "joined_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone, default: database_constants_1.DatabaseDefaultValues.now, nullable: true, comment: 'This is the timestamp of the last message read by the participant.' }),
    __metadata("design:type", Date)
], Participant.prototype, "read_last_message_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: 'true', comment: 'This is the flag that indicates if the participant is active.' }),
    __metadata("design:type", Boolean)
], Participant.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Conversation_1.default, conversation => conversation.participants),
    (0, typeorm_1.JoinColumn)({ name: 'conversation_id' }),
    __metadata("design:type", Conversation_1.default)
], Participant.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Message_1.default, message => message.sender),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Array)
], Participant.prototype, "messages", void 0);
Participant = __decorate([
    (0, typeorm_1.Entity)('participants')
], Participant);
exports.default = Participant;
