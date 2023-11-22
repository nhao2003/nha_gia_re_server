import { Service } from 'typedi';
import { Repository, DataSource } from 'typeorm';
import Participant from '~/domain/databases/entity/Participant';
import Message from '~/domain/databases/entity/Message';
import Conversation from '~/domain/databases/entity/Conversation';
import e from 'express';
import { MessageTypes } from '~/constants/enum';
import { User } from '~/domain/databases/entity/User';
import { AppError } from '~/models/Error';
import { bool } from 'yup';

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
    const res = await this.conversationRepository.save(conversation);
    return this.getConversationById(res.id);
  };

  public async getConversationByUserIdAndOtherUserId(user_id: string, other_user_id: string) {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndSelect('conversation.messages', 'message')
      .leftJoinAndMapMany('conversation.users', User, 'user', 'user.id = participant.user_id')
      .where('conversation.id IN (SELECT A.conversation_id FROM participants A JOIN participants B ON A.conversation_id = B.conversation_id WHERE A.user_id = :user_id AND B.user_id = :other_user_id)', {
        user_id,
        other_user_id,
      })
      .getOne();
    return conversation;
  }

  public async getConversationByUserIdAndConversationId(user_id: string, conversation_id: string) {
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndSelect('conversation.messages', 'message')
      .leftJoinAndMapMany('conversation.users', User, 'user', 'user.id = participant.user_id')
      .where('participant.user_id = :user_id', { user_id })
      .andWhere('conversation.id = :conversation_id', { conversation_id })
      .getOne();
    return conversation;
  }

  public async getConversations(user_id: string) {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.id IN (SELECT conversation_id FROM participants WHERE user_id = :user_id)', { user_id })
      .leftJoinAndSelect('conversation.participants', 'participant')
      .leftJoinAndMapOne('conversation.last_message', Message, 'message', 'message.id = conversation.last_messsage_id')
      .leftJoinAndMapMany('conversation.users', User, 'user', 'user.id = participant.user_id')
      .getMany();
    return conversations;
  }

  public async getOrCreateConversation(user_id: string, other_user_id: string) {
    let isExist: boolean = true;
    let conversation = await this.getConversationByUserIdAndOtherUserId(user_id, other_user_id);
    if (!conversation) {
      conversation = await this.createConversation(user_id, other_user_id);
      isExist = false;
    }
    return {
      conversation,
      isExist,
    };
  }

  public async deleteConversation(user_id: string, other_user_id: string) {
    const conversation = await this.getConversationByUserIdAndOtherUserId(user_id, other_user_id);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    await this.messageRepository.delete({ conversation_id: conversation.id });
    await this.participantRepository.delete({ conversation_id: conversation.id });
    await this.conversationRepository.delete({ id: conversation.id });
    return conversation;
  }

  public async getConversationById(conversation_id: string) {
    const conversation = await this.conversationRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Conversation.participants', 'participant')
      .leftJoinAndSelect('Conversation.messages', 'message')
      .leftJoinAndMapMany('Conversation.users', User, 'user', 'user.id = participant.user_id')
      .where('Conversation.id = :conversation_id', { conversation_id })
      .getOne();
    return conversation;
  }

  public sendMessage = async (conversation_id: string, user_id: string, content: string) => {
    const message = new Message();
    message.conversation_id = conversation_id;
    message.content_type = MessageTypes.text;
    message.sender_id = user_id;
    message.content = {
      text: content,
    };
    return await this.messageRepository.save(message);
  };

  public async getMessages(conversation_id: string):Promise<Message[]> {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.conversation_id = :conversation_id', { conversation_id })
      .orderBy('message.sent_at', 'DESC')
      .getMany();
    return messages;
  }
}

export default ConversationService;
