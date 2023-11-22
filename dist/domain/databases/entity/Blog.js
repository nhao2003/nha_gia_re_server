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
const UserBlogFavorite_1 = require("./UserBlogFavorite");
let Blog = class Blog extends typeorm_1.BaseEntity {
    id;
    created_at;
    title;
    short_description;
    author;
    thumbnail;
    content;
    is_active;
    user_blog_favorites;
    num_views;
    // @VirtualColumn({
    //   query: (alias) => `SELECT COUNT(*) FROM user_blog_favorites WHERE user_blog_favorites.blog_id = ${alias}.id`,
    // })
    // num_of_favorites!: number;
    is_favorite;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], Blog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone, default: () => database_constants_1.DatabaseDefaultValues.now }),
    __metadata("design:type", Date)
], Blog.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 255 }),
    __metadata("design:type", String)
], Blog.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text }),
    __metadata("design:type", String)
], Blog.prototype, "short_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50 }),
    __metadata("design:type", String)
], Blog.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text }),
    __metadata("design:type", String)
], Blog.prototype, "thumbnail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text }),
    __metadata("design:type", String)
], Blog.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: database_constants_1.DatabaseDefaultValues.true }),
    __metadata("design:type", Boolean)
], Blog.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserBlogFavorite_1.UserBlogFavorite, (userBlogFavorite) => userBlogFavorite.blog),
    (0, typeorm_1.JoinColumn)({ name: 'id', referencedColumnName: 'blog_id' }),
    __metadata("design:type", Array)
], Blog.prototype, "user_blog_favorites", void 0);
__decorate([
    (0, typeorm_1.VirtualColumn)({
        query: (alias) => `SELECT COUNT(*) FROM user_blog_views WHERE user_blog_views.blog_id = ${alias}.id`,
    }),
    __metadata("design:type", Number)
], Blog.prototype, "num_views", void 0);
__decorate([
    (0, typeorm_1.VirtualColumn)({
        query: (alias) => `SELECT CASE
      WHEN EXISTS (SELECT * FROM user_blog_favorites WHERE user_blog_favorites.blog_id = ${alias}.id AND user_blog_favorites.user_id = :current_user_id) THEN TRUE
      ELSE FALSE
  END`,
    }),
    __metadata("design:type", Boolean)
], Blog.prototype, "is_favorite", void 0);
Blog = __decorate([
    (0, typeorm_1.Entity)('blogs')
], Blog);
exports.default = Blog;
