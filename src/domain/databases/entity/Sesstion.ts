import { BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Entity } from 'typeorm';
import { ISession } from '../interfaces/ISession';
import { User } from './User';
import { DatabaseDefaultValues, PostgresDataType } from '../constants/database_constants';
import { CreateDateColumn } from 'typeorm';

@Entity('sessions')
export class Session extends BaseEntity implements ISession {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column(PostgresDataType.uuid)
  user_id!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, default: () =>  DatabaseDefaultValues.now })
  starting_date!: Date;

  @Column({ type: PostgresDataType.timestamp_without_timezone })
  expiration_date!: Date;
}
