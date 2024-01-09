import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { NotificationType } from '~/constants/enum';
import { User } from './User';
import { PostgresDataType } from '../constants/database_constants';

interface INotification {
  id: string;
  user_id?: string;
  type: NotificationType;
  title: string;
  content: string;
  is_read: boolean;
  image: string | undefined;
  url: string | undefined;
  created_at: Date;
  data?: any;
}

@Entity('notifications')
class Notification extends BaseEntity implements INotification {
  @PrimaryColumn(PostgresDataType.uuid)
  id!: string;

  @Column({ type: PostgresDataType.uuid, name: 'user_id', nullable: true })
  user_id?: string;

  @Column({ type: PostgresDataType.varchar, length: 255, enum: NotificationType })
  type!: NotificationType;

  @Column({ type: PostgresDataType.varchar, length: 255 })
  title!: string;

  @Column({ type: PostgresDataType.text })
  content!: string;

  @Column({ type: PostgresDataType.boolean, default: false })
  is_read!: boolean;

  @Column({ type: PostgresDataType.text, nullable: true })
  image!: string | undefined;

  @Column({ type: PostgresDataType.text, nullable: true })
  url!: string | undefined;

  @Column({ type: PostgresDataType.jsonb, nullable: true })
  data?: any;

  @Column({ type: PostgresDataType.timestamp_without_timezone, default: () => 'now()' })
  created_at!: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}

export { Notification, INotification };
