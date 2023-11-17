import { Service } from 'typedi';
import { Repository, DataSource } from 'typeorm';
import Participant from '~/domain/databases/entity/Participant';
import Message from '~/domain/databases/entity/Message';
import Conversation from '~/domain/databases/entity/Conversation';
import e from 'express';

@Service()
class ConversationService {
  private conversationRepository: Repository<Conversation>;
  private messageRepository: Repository<Message>;
  private participantRepository: Repository<Participant>;
  constructor(dataSource: DataSource) {
    this.conversationRepository = dataSource.getRepository(Conversation);
    this.messageRepository = dataSource.getRepository(Message);
    this.participantRepository = dataSource.getRepository(Participant);
  }
  public createConversation = async (user_id: string, other_user_id: string) => {
    const conversation = await this.conversationRepository.save(new Conversation());
    const participant = new Participant();
    participant.user_id = user_id;
    participant.conversation_id = conversation.id;
    const otherParticipant = new Participant();
    otherParticipant.user_id = other_user_id;
    otherParticipant.conversation_id = conversation.id;
    conversation.participants = [participant, otherParticipant];
    return await this.conversationRepository.save(conversation);
  };

  public async getConversation(user_id: string, other_user_id: string) {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.participants', 'participant')
      .innerJoinAndSelect('conversation.messages', 'message')
      .where('participant.user_id = :user_id', { user_id })
      .andWhere('conversation.id IN (SELECT conversation_id FROM participants WHERE user_id = :other_user_id)', {
        other_user_id,
      })
      .getOne();
    return conversation;
  }

    public async getOrCreateConversation(user_id: string, other_user_id: string) {
        let conversation = await this.getConversation(user_id, other_user_id);
        if (!conversation) {
        conversation = await this.createConversation(user_id, other_user_id);
        }
        return conversation;
    }
}

export default ConversationService;