import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import IComment from '../interfaces/IComment';
import { DatabaseDefaultValues, PostgresDataType } from '../constants/database_constants';
import { Entity } from 'typeorm';

@Entity('comments')
class Comment extends BaseEntity implements IComment {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column({ type: PostgresDataType.uuid, nullable: true })
  parent_id!: string | null;

  @Column({ type: PostgresDataType.uuid })
  blog_id!: string;

  @Column({ type: PostgresDataType.uuid })
  user_id!: string;

  @Column({ type: PostgresDataType.uuid, nullable: true })
  reply_to_user_id!: string | null;

  @Column({ type: PostgresDataType.varchar, length: 255 })
  comment!: string;

  @Column({ type: PostgresDataType.timestamp_without_timezone, default: ()=> DatabaseDefaultValues.now })
  timestamp!: Date;

  @Column({ type: PostgresDataType.timestamp_without_timezone, default: ()=> DatabaseDefaultValues.now })
  updated_at!: Date;

  @Column({ type: PostgresDataType.boolean, default: 'true' })
  is_active!: boolean;
}

export default Comment;
