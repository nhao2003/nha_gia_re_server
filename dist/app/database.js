"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const configs_1 = __importDefault(require("../constants/configs"));
console.log(configs_1.default.isProduction);
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: configs_1.default.database.host,
    port: Number(configs_1.default.database.port),
    username: configs_1.default.database.user,
    password: configs_1.default.database.password,
    database: 'postgres',
    synchronize: false,
    logging: false,
    entities: [configs_1.default.isProduction ? 'dist/domain/databases/entity/*.js' : 'src/domain/databases/entity/*.ts'],
    migrations: [],
    subscribers: [],
});
exports.AppDataSource = AppDataSource;
