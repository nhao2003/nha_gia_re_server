"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const app_1 = require("./app");
async function startServer(dataSource) {
    await dataSource.initialize();
    console.log('Database connected');
    return (0, app_1.initApp)();
}
exports.startServer = startServer;
