import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import ITransaction from '../interfaces/ITransaction';
import { DatabaseDefaultValues, PostgresDataType } from '../constants/database_constants';
import { CreateDateColumn } from 'typeorm';
@Entity('transactions')
class Transaction extends BaseEntity implements ITransaction {
  @PrimaryGeneratedColumn(PostgresDataType.uuid, { comment: 'This is the primary key' })
  id!: string;

  @Column(PostgresDataType.uuid, { comment: 'This is the user id' })
  user_id!: string;

  @Column(PostgresDataType.uuid, { nullable: true, comment: 'This is the discount id' })
  discount_id: string | null = null;

  @Column(PostgresDataType.uuid, { comment: 'This is the package id' })
  package_id!: string;

  @Column(PostgresDataType.integer, { comment: 'This is the subscription id' })
  num_of_subscription_month!: number;

  @Column(PostgresDataType.text, { nullable: true, comment: 'This is the app transaction id' })
  app_trans_id: string | null = null;

  @Column({ type: PostgresDataType.varchar, length: 50, comment: 'This is the status of the transaction' })
  status!: string;

  @CreateDateColumn({
    type: PostgresDataType.timestamp_without_timezone,
    default: () => DatabaseDefaultValues.now,
    comment: 'This is the timestamp of the transaction',
  })
  timestamp!: Date;

  @Column({ type: PostgresDataType.bigint, comment: 'This is the amount of the transaction' })
  amount!: number;
  
  @Column({ type: PostgresDataType.varchar, length: 50 })
  platform!: string;

  @Column({ type: PostgresDataType.boolean, default: 'true', comment: 'Is the transaction active?' })
  is_active!: boolean;
}
export default Transaction;
