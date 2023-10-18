import { BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Entity } from "typeorm";
import { ISessions } from "../interfaces/ISessions";
import { User } from "./User";

@Entity('sessions')
export class Session extends BaseEntity implements ISessions {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user_id!: string;

  @Column({ type:'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP'})
  starting_date!: Date;

  @Column({ type:'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP + INTERVAL \'90 days\''})
  expiration_date!: Date;

  @Column({ type:'timestamp without time zone', default: () => 'CURRENT_TIMESTAMP'})
  updated_at!: Date;

  @Column({ type: 'boolean', default: 'true'})
  is_active!: boolean;

  // Many-to-One relationship with User
  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
