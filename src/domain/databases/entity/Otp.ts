import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { IOtp } from '../interfaces/IOtp';

@Entity('otps')
export class OTP extends BaseEntity implements IOtp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  type!: string;

  @Column({ type: 'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP' })
  issued_at!: Date;

  // Default expiration time is 10 minutes
  @Column({ type: 'timestamp without time zone', default: () => "CURRENT_TIMESTAMP + INTERVAL '5 minutes'" })
  expiration_time!: Date;

  @Column({ type: 'varchar', length: 255 })
  token!: string;

  @Column('uuid')
  user_id!: string;

  @Column({ type: 'boolean', default: 'false' })
  is_used!: boolean;

  @Column({ type: 'boolean', default: 'true' })
  is_active!: boolean;

  // Many-to-One relationship with User
  @ManyToOne(() => User, (user) => user.otps)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
