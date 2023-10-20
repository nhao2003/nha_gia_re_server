import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import IUserBlogView from '../interfaces/IUserBlogView';
import { PostgresDataType } from '../constants/database_constants';
@Entity('user_blog_views')
export class UserBlogView extends BaseEntity implements IUserBlogView {
  @PrimaryGeneratedColumn(PostgresDataType.uuid, {comment: 'This is the Primary Key'})
    id!: string;

  @Column({ type: PostgresDataType.uuid, comment: 'This is User ID'})
    user_id!: string;

  @Column({ type: PostgresDataType.uuid, comment: 'This is Blog ID'})
    blog_id!: string;

  @Column({ type: PostgresDataType.timestamp_without_timezone, comment: 'This is the timestamp of the user blog view'})
    view_timestamp!: Date;
}