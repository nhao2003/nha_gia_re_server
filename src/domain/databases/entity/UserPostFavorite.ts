import { Entity, BaseEntity, Column, ManyToOne, JoinColumn } from 'typeorm';
import IUserPostFavorite from '../interfaces/IUserPostFavorite';
import { PostgresDataType } from '../constants/database_constants';
import { CreateDateColumn } from 'typeorm';
import { RealEstatePost } from './RealEstatePost';
import { User } from './User';

@Entity('user_post_favorites')
class UserPostFavorite extends BaseEntity implements IUserPostFavorite {
  @Column({ primary: true, type: PostgresDataType.uuid, comment: 'This is the User ID.' })
  user_id!: string;

  @Column({ primary: true, type: PostgresDataType.uuid, comment: 'This is the Real Estate Post ID.'})
  real_estate_posts_id!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, comment: 'This is the timestamp of the user post like.'})
  like_timestamp!: Date;

  @ManyToOne(() => RealEstatePost, (real_estate_post) => real_estate_post.user_post_favorites)
  @JoinColumn({ name: 'real_estate_posts_id' })
  real_estate_post!: RealEstatePost;

  @ManyToOne(() => User, (user) => user.user_post_favorites)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
export default UserPostFavorite;
