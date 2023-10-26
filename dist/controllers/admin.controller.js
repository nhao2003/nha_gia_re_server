"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_services_1 = __importDefault(require("../services/admin.services"));
const post_services_1 = __importDefault(require("../services/post.services"));
const user_services_1 = __importDefault(require("../services/user.services"));
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
class AdminController {
    getPosts = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = post_services_1.default.buildPostQuery(req.query);
        const posts = await post_services_1.default.getPostsByQuery(query, req.user?.id);
        return res.json(posts);
    });
    approvePost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const result = await admin_services_1.default.approvePost(id);
        return res.json(result);
    });
    rejectPost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const { reason } = req.body;
        const result = await admin_services_1.default.rejectPost(id, reason);
        return res.json(result);
    });
    deletePost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const result = await admin_services_1.default.deletePost(id);
        return res.json(result);
    });
    getUsers = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = user_services_1.default.buildUserQuery(req.query);
        const users = await user_services_1.default.getUserByQuery(query);
        return res.json(users);
    });
}
exports.default = new AdminController();
