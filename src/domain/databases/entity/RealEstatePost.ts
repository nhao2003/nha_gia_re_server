import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column(PostgresDataType.boolean)
  post_approval_priority!: boolean;

  @Column(PostgresDataType.integer)
  update_count!: number;

  @Column({ type: PostgresDataType.boolean, default: true })
  is_active!: boolean;

  // Many-to-One relationship with User
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user!: User;

}
