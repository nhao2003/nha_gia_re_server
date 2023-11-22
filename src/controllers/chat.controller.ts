import { ReservedOrUserListener } from "node_modules/socket.io/dist/typed-events";
import { Socket } from "socket.io";
import ConversationService from "~/services/conversation.service";

interface SocketController {
    onConnection(socket: Socket) : void;
    onDisconnect(socket: Socket): void;
}

class ChatController implements SocketController {

    private conversationService: ConversationService;

    constructor(conversationService: ConversationService) {
        this.conversationService = conversationService;
    }
    onConnection(socket: Socket): void {
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
        socket.on('join', async (userId: string) => {
            console.log('Joining user:', userId);
            socket.join(userId);
        });
        socket.on('GetConversations', async (userId: string) => {
            try {
                console.log('Fetching conversations for user:', userId);
                const conversations = await this.conversationService.getConversations(userId);
                socket.emit('conversations', conversations);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        });
    }

    onDisconnect(socket: Socket): void {
        console.log(`Disconnected from chat`);
    }
}
