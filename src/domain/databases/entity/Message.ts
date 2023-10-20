import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn } from "typeorm";
import IMessage from "../interfaces/IMessage";
import { PostgresDataType } from '../constants/database_constants';

@Entity('messages')
 class Message extends BaseEntity implements IMessage {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
    id!: string;

  @Column(PostgresDataType.uuid)
    conversation_id!: string;

  @Column(PostgresDataType.uuid)
    sender_id!: string;

  @Column({type: PostgresDataType.varchar, length: 50})
    content_type!: string;

  @Column('jsonb')
  content: any;

  @CreateDateColumn({type: PostgresDataType.timestamp_without_timezone})
    sent_at!: Date;

  @Column()
    is_active!: boolean;
}
export default Message;