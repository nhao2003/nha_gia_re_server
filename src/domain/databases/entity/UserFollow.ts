import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IUserFollow } from '../interfaces/IUserFollow';
import { IUser } from '../interfaces';
import { PostgresDataType } from '../constants/database_constants';
import { User } from './User';

@Entity('user_follows')
export class UserFollow implements IUserFollow {
  @PrimaryColumn({ type: PostgresDataType.uuid })
  user_id!: string;

  @PrimaryColumn({ type: PostgresDataType.uuid })
  follow_id!: string;

  @Column({ type: PostgresDataType.timestamp_without_timezone, default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'follow_id' })
  follow!: User;
}
