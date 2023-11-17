import ConversationService from '~/services/conversation.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { Request, Response } from 'express';
import AppResponse from '~/models/AppRespone';
import { Service } from 'typedi';
@Service()
class ConversationController {
  private conversationService: ConversationService;
  constructor(conversationService: ConversationService) {
    this.conversationService = conversationService;
  }
  public getOrCreateConversation = wrapRequestHandler(async (req: Request, res: Response) => {
    const { user_id, other_user_id } = req.body;
    const conversation = await this.conversationService.getOrCreateConversation(user_id, other_user_id);
    const appResponse: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Get or create conversation successfully',
      result: conversation,
    };
    res.status(200).json(appResponse);
  });
}
export default ConversationController;
