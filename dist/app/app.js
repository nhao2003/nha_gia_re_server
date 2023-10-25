"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("../routes/auth.routes"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
const post_routes_1 = __importDefault(require("../routes/post.routes"));
const User_1 = require("../domain/databases/entity/User");
const error_middleware_1 = require("../middlewares/error.middleware");
const admin_routes_1 = __importDefault(require("../routes/admin.routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/posts', post_routes_1.default);
app.use('/api/v1/admin', admin_routes_1.default);
app.get('/', (req, res) => {
    User_1.User.find()
        .then((units) => {
        res.json(units);
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong' });
    });
});
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});
app.use(error_middleware_1.errorHandler);
exports.default = app;
