import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, OneToMany, JoinColumn } from 'typeorm';
import { IUser } from '../interfaces/IUser';
import { Session } from './Sesstion';
import { DefaultValue } from '~/constants/defaultValue';
import { Role, UserStatus } from '~/constants/enum';
import { DatabaseDefaultValues, PostgresDataType } from '../constants/database_constants';
import Address from '~/domain/typing/address';
import { RealEstatePost } from './RealEstatePost';
import Subscription from './Subscription ';
import Transaction from './Transaction';
import Report from './Report';
import {UserFollow}  from './UserFollow';
import { AccountVerificationRequest } from './AccountVerificationRequest';
import { Notification } from './Notification';
import UserPostFavorite from './UserPostFavorite';
@Entity('users')
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50, default: UserStatus.unverified, enum: UserStatus })
  status!: string;

  @Column({ type: PostgresDataType.boolean, default: false })
  is_identity_verified!: boolean;

  @Column({ type: PostgresDataType.varchar, default: Role.user })
  role!: string;

  @Column({ type: PostgresDataType.varchar, length: 255, unique: true })
  email!: string;

  @Column({ type: PostgresDataType.varchar, length: 255, select: false })
  password!: string;

  @Column(PostgresDataType.jsonb, { nullable: true })
  address!: Address;

  @Column({ type: PostgresDataType.varchar, length: 50, default: DefaultValue.UNKNOW })
  first_name!: string;

  @Column({ type: PostgresDataType.varchar, length: 50, default: DefaultValue.UNKNOW })
  last_name!: string;

  @Column({ type: PostgresDataType.boolean, default: 'false' })
  gender!: boolean;

  @Column({ type: PostgresDataType.text, nullable: true })
  avatar!: string;

  @Column({ type: PostgresDataType.date, nullable: true })
  dob!: Date;

  @Column({ type: PostgresDataType.varchar, default: DefaultValue.UNKNOW })
  phone!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now })
  created_at!: Date;

  @Column(PostgresDataType.timestamp_without_timezone, { nullable: true })
  updated_at!: Date;

  @Column(PostgresDataType.timestamp_without_timezone, { nullable: true })
  banned_util!: Date | null;

  @Column(PostgresDataType.text, { nullable: true })
  ban_reason!: string | null;

  @OneToMany(() => RealEstatePost, (real_estate_posts) => real_estate_posts.user)
  posts!: RealEstatePost[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  @JoinColumn({ name: 'id' })
  subscriptions!: Subscription[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  @JoinColumn({ name: 'id' })
  transactions!: Transaction[];

  @OneToMany(() => Report, (report) => report.reporter)
  @JoinColumn({ name: 'id' })
  reports!: Report[];

  @OneToMany(() => UserFollow, (user_follow) => user_follow.user)
  @JoinColumn({ name: 'id' })
  following!: UserFollow[];

  @OneToMany(() => UserFollow, (user_follow) => user_follow.follow)
  @JoinColumn({ name: 'id' })
  followers!: UserFollow[];

  @OneToMany(() => AccountVerificationRequest, (account_verification_request) => account_verification_request.user)
  @JoinColumn({ name: 'id' })
  account_verification_requests!: AccountVerificationRequest[];

  @OneToMany(() => Notification, (notification) => notification.user)
  @JoinColumn({ name: 'id' })
  notifications!: Notification[];

  @OneToMany(() => UserPostFavorite, (user_post_favorite) => user_post_favorite.user)
  @JoinColumn({ name: 'id' })
  user_post_favorites!: UserPostFavorite[];
}
