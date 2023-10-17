import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BaseEntity, OneToMany } from 'typeorm';
import { IUser } from '../interfaces/IUser';
import { OTP } from './Otp';
import { Session } from './Sesstion';
import { hashPassword } from '~/utils/crypto';
import { DefaultValue } from '~/constants/defaultValue';
import { Role, UserStatus } from '~/constants/enum';

@Entity('users')
export class User extends BaseEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, default: UserStatus.unverified })
  status!: string;

  @Column({ type: 'boolean', default: false })
  is_identity_verified!: boolean;

  @Column({ type: 'varchar', default: Role.user })
  role!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column('jsonb', { nullable: true })
  address: any;

  @Column({ type: 'varchar', length: 50, default: DefaultValue.UNKNOW })
  first_name!: string;

  @Column({ type: 'varchar', length: 50, default: DefaultValue.UNKNOW })
  last_name!: string;

  @Column({ type: 'boolean', default: 'false' })
  gender!: boolean;

  @Column({ type: 'text', nullable: true })
  avatar!: string;

  @Column({ type: 'date', default: new Date('01/01/1970') })
  dob!: Date;

  @Column({ type: 'varchar', default: DefaultValue.UNKNOW })
  phone!: string;

  @Column({ type: 'timestamptz', default: new Date() })
  last_active_at!: Date;

  @CreateDateColumn({ type: 'timestamptz', default: new Date() })
  created_at!: Date;

  @Column('timestamptz', { nullable: true })
  updated_at!: Date;

  @Column('timestamptz', { nullable: true })
  banned_util!: Date;

  @Column('text', { nullable: true })
  ban_reason!: string;

  @Column({ type: 'boolean', default: false })
  is_active!: boolean;

  // One-to-Many relationship with OTP
  @OneToMany(() => OTP, (otp) => otp.user)
  otps!: OTP[];

  //One-to-Many relationship with Session
  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];
}
