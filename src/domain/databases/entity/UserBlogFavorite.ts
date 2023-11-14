import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PostgresDataType } from '../constants/database_constants';
import Blog from './Blog';

@Entity('user_blog_favorites')
export class UserBlogFavorite {
  @Column({ type: PostgresDataType.uuid, primary: true, comment: 'This is User ID' })
  user_id!: string;

  @Column({ type: PostgresDataType.uuid, primary: true, comment: 'This is Blog ID' })
  blog_id!: string;

  @CreateDateColumn({
    type: PostgresDataType.timestamp_without_timezone,
    comment: 'This is the timestamp of the user blog favorite',
  })
  timestamp!: Date;

  @ManyToOne(() => Blog, (blog) => blog.user_blog_favorites)
  @JoinColumn({ name: 'blog_id', referencedColumnName: 'id' })
  blog!: Blog;
}
