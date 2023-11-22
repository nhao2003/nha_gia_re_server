"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketServer = void 0;
const socket_io_1 = require("socket.io");
const di_1 = __importDefault(require("../di/di"));
const conversation_service_1 = __importDefault(require("../services/conversation.service"));
const admin_ui_1 = require("@socket.io/admin-ui");
const auth_service_1 = __importDefault(require("../services/auth.service"));
var SocketEvent;
(function (SocketEvent) {
    SocketEvent["Init"] = "init";
    SocketEvent["New"] = "new";
    SocketEvent["Update"] = "update";
    SocketEvent["Delete"] = "delete";
})(SocketEvent || (SocketEvent = {}));
async function createSocketServer(server) {
    const conversationService = di_1.default.get(conversation_service_1.default);
    const authService = di_1.default.get(auth_service_1.default);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: [
                'http://localhost:3000/',
                'https://admin.socket.io/',
                'https://socket.io/',
                'http://localhost:3000',
                'https://admin.socket.io',
            ],
            credentials: true,
        },
    });
    // Set up admin UI
    (0, admin_ui_1.instrument)(io, {
        auth: false,
        mode: 'development',
    });
    // Conversations namespace
    const chatNamespace = io.of('/conversations');
    chatNamespace.on('connection', async (socket) => {
        const token = getTokenFromSocket(socket);
        if (!token) {
            handleInvalidUserId(socket);
            return;
        }
        let user_id;
        try {
            const user = await authService.verifyUserByAccessToken(token);
            if (!user) {
                handleInvalidUserId(socket);
                return;
            }
            user_id = user.id;
        }
        catch (error) {
            handleSocketError(socket, error);
            return;
        }
        console.log('User connected: ', user_id);
        console.log(socket.handshake.query);
        socket.join(user_id);
        try {
            const conversations = await conversationService.getConversations(user_id);
            console.log(conversations);
            chatNamespace.to(user_id).emit('conversations', {
                type: SocketEvent.Init,
                data: conversations,
            });
        }
        catch (error) {
            handleSocketError(socket, error);
        }
        socket.onAny((event, ...args) => {
            console.log(event, args);
        });
        socket.on('get_or_create_conversation', async (arg) => {
            console.log('Get_or_create_conversation: ', arg);
            try {
                const other_user_id = arg.other_user_id;
                const { conversation, isExist } = await conversationService.getOrCreateConversation(user_id, other_user_id);
                if (!isExist) {
                    chatNamespace.to(other_user_id).emit('conversations', {
                        type: SocketEvent.New,
                        data: conversation,
                    });
                }
                chatNamespace.to(user_id).emit('conversations', {
                    type: SocketEvent.New,
                    data: conversation,
                });
            }
            catch (error) {
                handleSocketError(socket, error);
            }
        });
        socket.on('init_chat', async (arg) => {
            const conversation_id = arg ?? null;
            console.log('Init chat: ', conversation_id);
            try {
                const conversation = await conversationService.getConversationByUserIdAndConversationId(user_id, conversation_id);
                if (!conversation) {
                    handleInvalidConversation(socket);
                    return;
                }
                socket.join(conversation_id);
                console.log("Join conversation: ", conversation_id);
                const messages = await conversationService.getMessages(conversation_id);
                console.log(messages);
                chatNamespace.to(conversation_id).emit('messages', {
                    type: SocketEvent.Init,
                    conversation_id,
                    data: messages,
                });
            }
            catch (error) {
                console.log(error);
                handleSocketError(socket, error);
            }
        });
        socket.on('send_message', async (arg) => {
            console.log('Send message: ', arg);
            try {
                const content = arg.content;
                const conversation_id = arg.conversation_id;
                const message = await conversationService.sendMessage(conversation_id, user_id, content);
                chatNamespace.to(conversation_id).emit('messages', {
                    type: SocketEvent.New,
                    conversation_id,
                    data: message,
                });
            }
            catch (error) {
                handleSocketError(socket, error);
            }
        });
    });
    return io;
}
exports.createSocketServer = createSocketServer;
function getTokenFromSocket(socket) {
    return socket.handshake.auth.token || socket.handshake.headers.authorization || null;
}
function getConversationIdFromSocket(socket) {
    return socket.handshake.query.conversation_id || null;
}
function handleInvalidConversationId(socket) {
    socket.disconnect();
}
function handleInvalidUserId(socket) {
    socket.emit('conversations', []); // Send an empty conversations array
    socket.disconnect();
}
function handleInvalidConversation(socket) {
    socket.disconnect();
}
function handleSocketError(socket, error) {
    console.error(`Socket error: ${error.message}`);
    socket.disconnect();
}
