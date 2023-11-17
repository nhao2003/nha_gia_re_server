import { Router } from "express";
import ConversationController from "~/controllers/conversation.controller";
import DependencyInjection from '~/di/di';
const router = Router();
const conversationController = DependencyInjection.get<ConversationController>(ConversationController);
router.post("/conversation", conversationController.getOrCreateConversation);
export default router;