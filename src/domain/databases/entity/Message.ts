import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import IMessage from "../interfaces/IMessage";
import { PostgresDataType } from '../constants/database_constants';
import Conversation from "./Conversation";
import Participant from "./Participant";
import { MessageTypes } from "~/constants/enum";

@Entity('messages')
 class Message extends BaseEntity implements IMessage {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
    id!: string;

  @Column(PostgresDataType.uuid)
    conversation_id!: string;

  @Column(PostgresDataType.uuid)
    sender_id!: string;

  @Column({type: PostgresDataType.varchar, length: 50, enum: Object.values(MessageTypes)})
    content_type!: MessageTypes;

  @Column('jsonb')
  content: any;

  @CreateDateColumn({type: PostgresDataType.timestamp_without_timezone})
    sent_at!: Date;

  @Column({type: PostgresDataType.boolean, default: 'true'})
    is_active!: boolean;

  @ManyToOne(() => Conversation, conversation => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation!: Conversation;

  @ManyToOne(() => Participant  , participant => participant.messages)
  @JoinColumn({ name: 'sender_id' })
  sender!: Participant;

}
export default Message;