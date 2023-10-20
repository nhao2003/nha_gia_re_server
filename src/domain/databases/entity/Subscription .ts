import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import ISubscription from '../interfaces/ISubscription';
import { DatabaseDefaultValues, PostgresDataType } from '../constants/database_constants';
@Entity('subscriptions')
class Subscription extends BaseEntity implements ISubscription {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column(PostgresDataType.uuid)
  user_id!: string;

  @Column(PostgresDataType.uuid)
  package_id!: string;

  @Column({type: PostgresDataType.text,  nullable: true })
  transaction_id!: string | null;

  @Column({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now})
  starting_date!: Date;

  @Column({ type: PostgresDataType.timestamp_without_timezone})
  expiration_date!: Date;

  @Column({ type: PostgresDataType.boolean, default: 'true'})
  is_active!: boolean;
}

export default Subscription;
