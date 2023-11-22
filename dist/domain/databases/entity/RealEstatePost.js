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
exports.RealEstatePost = void 0;
const typeorm_1 = require("typeorm");
const database_constants_1 = require("../constants/database_constants");
const typeorm_2 = require("typeorm");
const address_1 = __importDefault(require("../../../domain/typing/address"));
const User_1 = require("./User");
const address_utils_1 = __importDefault(require("../../../utils/address_utils"));
let RealEstatePost = class RealEstatePost extends typeorm_1.BaseEntity {
    id;
    user_id;
    project_id;
    type_id;
    unit_id;
    status;
    title;
    description;
    area;
    address;
    address_point;
    price;
    deposit;
    is_lease;
    posted_date;
    expiry_date;
    images;
    videos;
    is_pro_seller;
    info_message;
    display_priority_point;
    features;
    post_approval_priority_point;
    update_count;
    is_active;
    num_favourites;
    num_views;
    //Check the user who query the post is favorite or not. True if favorite, false if not
    is_favorite;
    // Many-to-One relationship with User
    user;
    address_detail;
    addAddressDetail() {
        if (!this.address)
            return "";
        let val = address_utils_1.default.getDetailedAddress(this.address.province_code, this.address.district_code, this.address.ward_code);
        if (this.address.detail) {
            val = `${this.address.detail}, ${val}`;
        }
        this.address_detail = val;
    }
};
exports.RealEstatePost = RealEstatePost;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], RealEstatePost.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.uuid),
    __metadata("design:type", String)
], RealEstatePost.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.uuid, { nullable: true }),
    __metadata("design:type", String)
], RealEstatePost.prototype, "project_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50 }),
    __metadata("design:type", String)
], RealEstatePost.prototype, "type_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50, nullable: true }),
    __metadata("design:type", String)
], RealEstatePost.prototype, "unit_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, nullable: true }),
    __metadata("design:type", String)
], RealEstatePost.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.text),
    __metadata("design:type", String)
], RealEstatePost.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.text),
    __metadata("design:type", String)
], RealEstatePost.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.double_precision),
    __metadata("design:type", Number)
], RealEstatePost.prototype, "area", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.jsonb),
    __metadata("design:type", address_1.default)
], RealEstatePost.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.point, { nullable: true }),
    __metadata("design:type", String)
], RealEstatePost.prototype, "address_point", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.bigint),
    __metadata("design:type", Number)
], RealEstatePost.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.bigint, { nullable: true }),
    __metadata("design:type", Number)
], RealEstatePost.prototype, "deposit", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.boolean),
    __metadata("design:type", Boolean)
], RealEstatePost.prototype, "is_lease", void 0);
__decorate([
    (0, typeorm_2.CreateDateColumn)({ type: database_constants_1.PostgresDataType.timestamp_without_timezone }),
    __metadata("design:type", Date)
], RealEstatePost.prototype, "posted_date", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.timestamp_without_timezone),
    __metadata("design:type", Date)
], RealEstatePost.prototype, "expiry_date", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.text, { array: true }),
    __metadata("design:type", Array)
], RealEstatePost.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.text, { array: true, nullable: true }),
    __metadata("design:type", Array)
], RealEstatePost.prototype, "videos", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.boolean),
    __metadata("design:type", Boolean)
], RealEstatePost.prototype, "is_pro_seller", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text, nullable: true }),
    __metadata("design:type", Object)
], RealEstatePost.prototype, "info_message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.text, default: 0 }),
    __metadata("design:type", Number)
], RealEstatePost.prototype, "display_priority_point", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.jsonb),
    __metadata("design:type", Object)
], RealEstatePost.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.integer),
    __metadata("design:type", Number)
], RealEstatePost.prototype, "post_approval_priority_point", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.integer),
    __metadata("design:type", Number)
], RealEstatePost.prototype, "update_count", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: true }),
    __metadata("design:type", Boolean)
], RealEstatePost.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.VirtualColumn)({
        query: (alias) => `SELECT COUNT(*) FROM user_post_favorites WHERE user_post_favorites.real_estate_posts_id = ${alias}.id`,
    }),
    __metadata("design:type", Number)
], RealEstatePost.prototype, "num_favourites", void 0);
__decorate([
    (0, typeorm_1.VirtualColumn)({
        query: (alias) => `SELECT COUNT(*) FROM user_post_views WHERE user_post_views.real_estate_posts_id = ${alias}.id`,
    }),
    __metadata("design:type", Number)
], RealEstatePost.prototype, "num_views", void 0);
__decorate([
    (0, typeorm_1.VirtualColumn)({
        query: (alias) => `SELECT CASE
      WHEN EXISTS (SELECT * FROM user_post_favorites WHERE user_post_favorites.real_estate_posts_id = ${alias}.id AND user_post_favorites.user_id = :current_user_id) THEN TRUE
      ELSE FALSE
  END`,
    }),
    __metadata("design:type", Boolean)
], RealEstatePost.prototype, "is_favorite", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.posts),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_1.User)
], RealEstatePost.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RealEstatePost.prototype, "addAddressDetail", null);
exports.RealEstatePost = RealEstatePost = __decorate([
    (0, typeorm_1.Entity)('real_estate_posts')
], RealEstatePost);
