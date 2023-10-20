import { Entity, Column, BaseEntity } from 'typeorm';
import IUserCommentLike from '../interfaces/IUserCommentLike';
import { PostgresDataType } from '../constants/database_constants';
import { CreateDateColumn } from 'typeorm';
@Entity('user_comment_likes')
class UserCommentLike extends BaseEntity implements IUserCommentLike {
  @Column({ primary: true, type: PostgresDataType.uuid, comment: 'This is the Comment ID.' })
  comment_id!: string;

  @Column({ primary: true, type: PostgresDataType.uuid, comment: 'This is the User ID.'})
  user_id!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, comment: 'This is the timestamp of the user comment like.'})
  timestamp!: Date;
}
export default UserCommentLike;
