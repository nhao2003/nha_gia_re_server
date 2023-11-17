import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BaseEntity, OneToMany, JoinColumn } from 'typeorm';
import { PostgresDataType } from '../constants/database_constants';
import IConversation from '../interfaces/IConversation';
import Participant from './Participant';
import Message from './Message';

@Entity('conversations')
class Conversation extends BaseEntity implements IConversation {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @CreateDateColumn({ type: PostgresDataType.date })
  created_at!: Date;

  @Column({ type: PostgresDataType.uuid, nullable: true })
  last_messsage_id!: string;

  @Column({ type: PostgresDataType.boolean, default: 'true' })
  is_active!: boolean;

  @OneToMany(() => Participant, participant => participant.conversation)
  @JoinColumn({ name: 'id' })
  participants!: Participant[];

  @OneToMany(() => Message, message => message.conversation)
  @JoinColumn({ name: 'id' })
  messages!: Message[];
}

export default Conversation;