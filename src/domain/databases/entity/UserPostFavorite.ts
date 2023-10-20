import { Entity, BaseEntity, Column } from 'typeorm';
import IUserPostFavorite from '../interfaces/IUserPostFavorite';
import { PostgresDataType } from '../constants/database_constants';
import { CreateDateColumn } from 'typeorm';

@Entity('user_post_favorites')
class UserPostFavorite extends BaseEntity implements IUserPostFavorite {
  @Column({ primary: true, type: PostgresDataType.uuid, comment: 'This is the User ID.' })
  users_id!: string;

  @Column({ primary: true, type: PostgresDataType.uuid, comment: 'This is the Real Estate Post ID.'})
  real_estate_posts_id!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, comment: 'This is the timestamp of the user post like.'})
  like_timestamp!: Date;
}
export default UserPostFavorite;
