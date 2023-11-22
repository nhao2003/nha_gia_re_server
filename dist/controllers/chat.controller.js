"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatController {
    conversationService;
    constructor(conversationService) {
        this.conversationService = conversationService;
    }
    onConnection(socket) {
        console.log(`Connected to chat`);
        if (!socket.handshake.auth || !socket.handshake.auth.token) {
            socket.disconnect();
            return;
        }
        console.log(socket.handshake.auth);
        socket.use(async (packet, next) => {
            console.log('Packet:', packet);
            next();
        });
        socket.on('join', async (userId) => {
            console.log('Joining user:', userId);
            socket.join(userId);
        });
        socket.on('GetConversations', async (userId) => {
            try {
                console.log('Fetching conversations for user:', userId);
                const conversations = await this.conversationService.getConversations(userId);
                socket.emit('conversations', conversations);
            }
            catch (error) {
                console.error('Error fetching conversations:', error);
            }
        });
    }
    onDisconnect(socket) {
        console.log(`Disconnected from chat`);
    }
}
