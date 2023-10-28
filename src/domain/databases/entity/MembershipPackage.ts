import { PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity } from 'typeorm';
import { Entity } from 'typeorm';
import { PostgresDataType } from '../constants/database_constants';
import IMembershipPackage from '../interfaces/IMembershipPackage';

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
  monthy_post_limit!: number;

  @Column({ type: PostgresDataType.integer })
  post_approval_priority_point!: number;

  @Column({ type: PostgresDataType.integer })
  display_priority_point!: number;

  @Column({ type: PostgresDataType.boolean, default: 'true' })
  is_active!: boolean;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
  created_at!: Date;
}
export default MembershipPackage;
