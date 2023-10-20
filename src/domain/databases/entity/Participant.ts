import { Entity, Column, CreateDateColumn } from 'typeorm';
import { PostgresDataType } from '../constants/database_constants';

@Entity('participants')
class Participant {
  @Column({ primary: true, type: PostgresDataType.uuid, comment: 'This is the Conversation ID.'})
  conversation_id!: string;

  @Column({ primary: true, type: PostgresDataType.uuid, comment: 'This is the User ID.'})
  user_id!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, comment: 'This is the timestamp of the participant.'})
  joined_at!: Date;

  @Column({ type: PostgresDataType.timestamp_without_timezone, nullable: true, comment: 'This is the timestamp of the last message read by the participant.' })
  read_last_message_at!: Date;

  @Column({type: PostgresDataType.boolean, default: 'true', comment: 'This is the flag that indicates if the participant is active.'})
  is_active!: boolean;
}
export default Participant;
