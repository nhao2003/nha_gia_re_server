import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import ISubscription from '../interfaces/ISubscription';
import { DatabaseDefaultValues, PostgresDataType } from '../constants/database_constants';
import MembershipPackage from './MembershipPackage';
import { User } from './User';
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

  @ManyToOne(() =>MembershipPackage, membershipPackage => membershipPackage.subscriptions)
  @JoinColumn({ name: 'package_id' })
  membership_package!: MembershipPackage;

  @ManyToOne(() => User, user => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}

export default Subscription;
