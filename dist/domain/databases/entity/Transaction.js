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
let Transaction = class Transaction extends typeorm_1.BaseEntity {
    id;
    user_id;
    discount_id;
    package_id;
    num_of_subscription_month;
    app_trans_id;
    status;
    timestamp;
    amount;
    is_active;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(database_constants_1.PostgresDataType.uuid, { comment: 'This is the primary key' }),
    __metadata("design:type", String)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.uuid, { comment: 'This is the user id' }),
    __metadata("design:type", String)
], Transaction.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.uuid, { comment: 'This is the discount id' }),
    __metadata("design:type", String)
], Transaction.prototype, "discount_id", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.uuid, { comment: 'This is the package id' }),
    __metadata("design:type", String)
], Transaction.prototype, "package_id", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.integer, { comment: 'This is the subscription id' }),
    __metadata("design:type", Number)
], Transaction.prototype, "num_of_subscription_month", void 0);
__decorate([
    (0, typeorm_1.Column)(database_constants_1.PostgresDataType.text, { comment: 'This is the app transaction id' }),
    __metadata("design:type", String)
], Transaction.prototype, "app_trans_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.varchar, length: 50, comment: 'This is the status of the transaction' }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_2.CreateDateColumn)({
        type: database_constants_1.PostgresDataType.timestamp_without_timezone,
        default: () => database_constants_1.DatabaseDefaultValues.now,
        comment: 'This is the timestamp of the transaction',
    }),
    __metadata("design:type", Date)
], Transaction.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.bigint, comment: 'This is the amount of the transaction' }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: database_constants_1.PostgresDataType.boolean, default: 'true', comment: 'Is the transaction active?' }),
    __metadata("design:type", Boolean)
], Transaction.prototype, "is_active", void 0);
Transaction = __decorate([
    (0, typeorm_1.Entity)('transactions')
], Transaction);
exports.default = Transaction;
