"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./app/server");
const database_1 = require("./app/database");
const http_1 = __importDefault(require("http"));
const socket_1 = require("./app/socket");
const PORT = process.env.PORT || 8000;
(0, server_1.startServer)(database_1.AppDataSource)
    .then(async (app) => {
    let server;
    server = http_1.default.createServer(app);
    (0, socket_1.createSocketServer)(server);
    server.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.log('Server failed to start');
    console.log(err);
    process.exit(1);
});
