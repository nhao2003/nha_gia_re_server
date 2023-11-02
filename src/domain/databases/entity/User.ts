import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, OneToMany, JoinColumn } from 'typeorm';
import { IUser } from '../interfaces/IUser';
import { Session } from './Sesstion';
import { DefaultValue } from '~/constants/defaultValue';
import { Role, UserStatus } from '~/constants/enum';
import { DatabaseDefaultValues, PostgresDataType } from '../constants/database_constants';
import Address from '~/domain/typing/address';
import { RealEstatePost } from './RealEstatePost';
import Subscription from './Subscription ';
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

  @Column({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now })
  last_active_at!: Date;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now })
  created_at!: Date;

  @Column(PostgresDataType.timestamp_without_timezone, { nullable: true })
  updated_at!: Date;

  @Column(PostgresDataType.timestamp_without_timezone, { nullable: true })
  banned_util!: Date;

  @Column(PostgresDataType.text, { nullable: true })
  ban_reason!: string;

  @OneToMany(() => RealEstatePost, (real_estate_posts) => real_estate_posts.user)
  posts!: RealEstatePost[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  @JoinColumn({ name: 'id' })
  subscriptions!: Subscription[];

  // Method
  toJSON(): Record<string, any> {
    const user: Record<string, any> = { ...this };
    delete user.password;
    delete user.is_active;
    delete user.banned_util;
    delete user.ban_reason;
    delete user.sessions;
    delete user.otps;
    return user;
  }
}
