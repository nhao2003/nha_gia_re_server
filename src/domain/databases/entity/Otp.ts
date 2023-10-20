import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { DatabaseDefaultValues, PostgresDataType } from '../constants/database_constants';
import IOTP from '../interfaces/IOTP';

@Entity('otps')
export class OTP extends BaseEntity implements IOTP {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  type!: string;

  @Column({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now })
  issued_at!: Date;

  // Default expiration time is 10 minutes
  @Column({ type: PostgresDataType.timestamp_without_timezone })
  expiration_time!: Date;

  @Column({ type: PostgresDataType.varchar, length: 255 })
  token!: string;

  @Column('uuid')
  user_id!: string;

  @Column({ type: PostgresDataType.boolean, default: 'false' })
  is_used!: boolean;

  @Column({ type: PostgresDataType.boolean, default: 'true' })
  is_active!: boolean;

  // Many-to-One relationship with User
  @ManyToOne(() => User, (user) => user.otps)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
