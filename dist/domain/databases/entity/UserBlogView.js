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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBlogView = void 0;
const typeorm_1 = require("typeorm");
const database_constants_1 = require("../constants/database_constants");
let UserBlogView = class UserBlogView extends typeorm_1.BaseEntity {
    id;
    user_id;
    blog_id;
    view_timestamp;
};
exports.UserBlogView = UserBlogView;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid, { comment: 'This is the Primary Key' }),
    __metadata("design:type", String)
], UserBlogView.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.uuid, comment: 'This is User ID' }),
    __metadata("design:type", String)
], UserBlogView.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.uuid, comment: 'This is Blog ID' }),
    __metadata("design:type", String)
], UserBlogView.prototype, "blog_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone, comment: 'This is the timestamp of the user blog view' }),
    __metadata("design:type", Date)
], UserBlogView.prototype, "view_timestamp", void 0);
exports.UserBlogView = UserBlogView = __decorate([
    (0, typeorm_1.Entity)('user_blog_views')
], UserBlogView);
