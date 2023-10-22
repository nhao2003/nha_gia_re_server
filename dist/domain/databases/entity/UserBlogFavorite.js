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
exports.UserBlogFavorite = void 0;
const typeorm_1 = require("typeorm");
const database_constants_1 = require("../constants/database_constants");
let UserBlogFavorite = class UserBlogFavorite {
    user_id;
    blog_id;
    timestamp;
};
exports.UserBlogFavorite = UserBlogFavorite;
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.uuid, primary: true, comment: 'This is User ID' }),
    __metadata("design:type", String)
], UserBlogFavorite.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.uuid, primary: true, comment: 'This is Blog ID' }),
    __metadata("design:type", String)
], UserBlogFavorite.prototype, "blog_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone, comment: 'This is the timestamp of the user blog favorite' }),
    __metadata("design:type", Date)
], UserBlogFavorite.prototype, "timestamp", void 0);
exports.UserBlogFavorite = UserBlogFavorite = __decorate([
    (0, typeorm_1.Entity)('user_blog_favorites')
], UserBlogFavorite);
