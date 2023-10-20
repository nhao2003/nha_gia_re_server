import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import IMessage from "../interfaces/IMessage";

@Entity('messages')
 class Message extends BaseEntity implements IMessage {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @Column()
    conversation_id!: string;

  @Column()
    sender_id!: string;

  @Column()
    content_type!: string;

  @Column('jsonb')
  content: any;

  @Column()
    sent_at!: Date;

  @Column()
    is_active!: boolean;
}
export default Message;