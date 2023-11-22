"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initApp = void 0;
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("../routes/auth.routes"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
const post_routes_1 = __importDefault(require("../routes/post.routes"));
const blog_routes_1 = __importDefault(require("../routes/blog.routes"));
const membership_package_routes_1 = __importDefault(require("../routes/membership_package.routes"));
const media_routes_1 = __importDefault(require("../routes/media.routes"));
const report_routes_1 = __importDefault(require("../routes/report.routes"));
const conversation_routes_1 = __importDefault(require("../routes/conversation.routes"));
const User_1 = require("../domain/databases/entity/User");
const error_middleware_1 = require("../middlewares/error.middleware");
const admin_routes_1 = __importDefault(require("../routes/admin.routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
function initApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use((req, res, next) => {
        res.header({ 'Access-Control-Allow-Origin': '*' });
        console.log('/***********************/');
        console.log('Request URL:', req.originalUrl);
        console.log('Request Time:', new Date().toLocaleString());
        console.log('Request Type:', req.method);
        console.log('/***********************/');
        next();
    });
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(body_parser_1.default.json());
    app.use(express_1.default.json());
    app.use(express_1.default.static('public'));
    app.use('/api/v1/auth', auth_routes_1.default);
    app.use('/api/v1/users', user_routes_1.default);
    app.use('/api/v1/posts', post_routes_1.default);
    app.use('/api/v1/media', media_routes_1.default);
    app.use('/api/v1/admin', admin_routes_1.default);
    app.use('/api/v1/membership-package', membership_package_routes_1.default);
    app.use('/api/v1/reports', report_routes_1.default);
    app.use('/api/v1/blogs', blog_routes_1.default);
    app.use('/api/v1/conversations', conversation_routes_1.default);
    app.get('/', (req, res) => {
        User_1.User.find()
            .then((units) => {
            res.status(200).send(units);
        })
            .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'Something went wrong' });
        });
    });
    app.all('*', (req, res) => {
        const appRes = {
            status: 'fail',
            code: 404,
            message: `Can't find ${req.originalUrl} on this server!`,
        };
        res.status(404).json(appRes);
    });
    app.use(error_middleware_1.errorHandler);
    return app;
}
exports.initApp = initApp;
