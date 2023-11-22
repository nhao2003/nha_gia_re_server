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
const typeorm_1 = require("typeorm");
const database_constants_1 = require("../constants/database_constants");
const typeorm_2 = require("typeorm");
let UserPostView = class UserPostView extends typeorm_1.BaseEntity {
    user_id;
    real_estate_posts_id;
    view_date;
};
__decorate([
    (0, typeorm_1.Column)({ primary: true, type: database_constants_1.PostgresDataType.uuid, comment: 'This is the User ID.' }),
    __metadata("design:type", String)
], UserPostView.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ primary: true, type: database_constants_1.PostgresDataType.uuid, comment: 'This is the Real Estate Post ID.' }),
    __metadata("design:type", String)
], UserPostView.prototype, "real_estate_posts_id", void 0);
__decorate([
    (0, typeorm_2.CreateDateColumn)({
        primary: true,
        type: database_constants_1.PostgresDataType.date,
        comment: 'This is the timestamp of the user post like.',
    }),
    __metadata("design:type", Date)
], UserPostView.prototype, "view_date", void 0);
UserPostView = __decorate([
    (0, typeorm_1.Entity)('user_post_views')
], UserPostView);
exports.default = UserPostView;
