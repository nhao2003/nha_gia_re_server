import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, VirtualColumn } from 'typeorm';
import IRealEstatePost from '../interfaces/IRealEstatePost';
import { PostgresDataType } from '../constants/database_constants';
import { CreateDateColumn } from 'typeorm';
import Address from '~/domain/typing/address';
import { User } from './User';
import { OneToMany } from 'typeorm/browser';

@Entity('real_estate_posts')
export class RealEstatePost extends BaseEntity implements IRealEstatePost {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column(PostgresDataType.uuid)
  user_id!: string;

  @Column(PostgresDataType.uuid, { nullable: true })
  project_id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  type_id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50, nullable: true })
  unit_id!: string;

  @Column({ type: PostgresDataType.varchar, nullable: true })
  status!: string;

  @Column(PostgresDataType.text)
  title!: string;

  @Column(PostgresDataType.text)
  description!: string;

  @Column(PostgresDataType.double_precision)
  area!: number;

  @Column(PostgresDataType.jsonb)
  address!: Address;

  @Column(PostgresDataType.point, { nullable: true })
  address_point!: string;

  @Column(PostgresDataType.bigint)
  price!: number;

  @Column(PostgresDataType.bigint, { nullable: true })
  deposit!: number;

  @Column(PostgresDataType.boolean)
  is_lease!: boolean;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  posted_date!: Date;

  @Column(PostgresDataType.timestamp_without_timezone)
  expiry_date!: Date;

  @Column(PostgresDataType.text, { array: true })
  images!: string[];

  @Column(PostgresDataType.text, { array: true, nullable: true })
  videos!: string[];

  @Column(PostgresDataType.boolean)
  is_pro_seller!: boolean;

  @Column({ type: PostgresDataType.text, nullable: true })
  info_message: string | null | undefined;

  @Column({ type: PostgresDataType.text, default: 0 })
  priority_level!: number;

  @Column(PostgresDataType.jsonb)
  features: any;

  @Column(PostgresDataType.integer)
  post_approval_priority_point!: number;

  @Column(PostgresDataType.integer)
  update_count!: number;

  @Column({ type: PostgresDataType.boolean, default: true })
  is_active!: boolean;

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT(*) FROM user_post_favorites WHERE user_post_favorites.real_estate_posts_id = ${alias}.id`,
  })
  num_favourites!: number;

  @VirtualColumn({
    query: (alias) => `SELECT COUNT(*) FROM user_post_views WHERE user_post_views.real_estate_posts_id = ${alias}.id`,
  })
  num_views!: number;

  //Check the user who query the post is favorite or not. True if favorite, false if not
  @VirtualColumn({
    query: (alias) =>
      `SELECT CASE
      WHEN EXISTS (SELECT * FROM user_post_favorites WHERE user_post_favorites.real_estate_posts_id = ${alias}.id AND user_post_favorites.user_id = :current_user_id) THEN TRUE
      ELSE FALSE
  END`,
  })
  is_favorite!: boolean;

  // Many-to-One relationship with User
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
