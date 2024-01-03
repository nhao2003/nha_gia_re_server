import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
  VirtualColumn,
} from 'typeorm';
import { DatabaseDefaultValues, PostgresDataType } from '../constants/database_constants';
import IBlog from '../interfaces/IBlog';

@Entity('blogs')
class Blog extends BaseEntity implements IBlog {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @CreateDateColumn({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now })
  created_at!: Date;

  @Column({ type: PostgresDataType.varchar, length: 255 })
  title!: string;

  @Column({ type: PostgresDataType.text })
  short_description!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  author!: string;

  @Column({ type: PostgresDataType.text })
  thumbnail!: string;

  @Column({ type: PostgresDataType.text })
  content!: string;

  @Column({ type: PostgresDataType.boolean, default: DatabaseDefaultValues.true })
  is_active!: boolean;
}
export default Blog;
