import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { DatabaseDefaultValues, PostgresDataType } from '../constants/database_constants';
import IOTP from '../interfaces/IOtp';

@Entity('otps')
export class OTP extends BaseEntity implements IOTP {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  type!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone })
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
}
