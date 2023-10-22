"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapRequestHandler = void 0;
function wrapRequestHandler(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            console.error("Catch in wrapRequestHandler:");
            console.error(error);
            next(error);
        }
    };
}
exports.wrapRequestHandler = wrapRequestHandler;
