import { PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, OneToMany, JoinColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { PostgresDataType } from '../constants/database_constants';
import IMembershipPackage from '../interfaces/IMembershipPackage';
import Subscription from './Subscription ';
import Transaction from './Transaction';

@Entity('membership_packages')
class MembershipPackage  extends BaseEntity implements IMembershipPackage{
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  name!: string;

  @Column({ type: PostgresDataType.text })
  description!: string;

  @Column({ type: PostgresDataType.bigint })
  price_per_month!: number;

  @Column({ type: PostgresDataType.integer })
  monthly_post_limit!: number;

  @Column({ type: PostgresDataType.integer })
  post_approval_priority_point!: number;

  @Column({ type: PostgresDataType.integer })
  display_priority_point!: number;

  @Column({ type: PostgresDataType.boolean, default: 'true' })
  is_active!: boolean;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  created_at!: Date;

  @OneToMany(() => Subscription, subscription => subscription.membership_package)
  @JoinColumn({ name: 'id' })
  subscriptions!: Subscription[];

  @OneToMany(() => Transaction, transaction => transaction.package)
  @JoinColumn({ name: 'id' })
  transactions!: Transaction[];
}
export default MembershipPackage;
