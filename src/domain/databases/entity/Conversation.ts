import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BaseEntity } from 'typeorm';
import { PostgresDataType } from '../constants/database_constants';
import IConversation from '../interfaces/IConversation';

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
}

export default Conversation;