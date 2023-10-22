import { Entity, BaseEntity, Column } from 'typeorm';
import { PostgresDataType } from '../constants/database_constants';
import { CreateDateColumn } from 'typeorm';
import IUserPostView from '../interfaces/IUserPostView';

@Entity('user_post_views')
class UserPostView  extends BaseEntity implements IUserPostView  {
  @Column({ primary: true, type: PostgresDataType.uuid, comment: 'This is the User ID.' })
  users_id!: string;

  @Column({ primary: true, type: PostgresDataType.uuid, comment: 'This is the Real Estate Post ID.'})
  real_estate_posts_id!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, comment: 'This is the timestamp of the user post like.'})
  view_timestamp!: Date;
}
export default UserPostView ;