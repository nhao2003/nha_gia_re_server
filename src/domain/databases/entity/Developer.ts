import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import IDeveveloper from '../interfaces/IDeveloper';
import { DatabaseDefaultValues, PostgresDataType } from '../constants/database_constants';
import { OneToMany } from 'typeorm';
import { Project } from './Project';

@Entity('developers')
export class Developer extends BaseEntity implements IDeveveloper {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  name!: string;

  @Column({ type: PostgresDataType.text })
  description!: string;

  @Column(PostgresDataType.varchar, { array: true })
  images!: string[];

  @Column({ type: PostgresDataType.timestamp_without_timezone, default: () => DatabaseDefaultValues.now })
  created_at!: Date;

  @Column({ type: PostgresDataType.boolean, default: 'true' })
  is_active!: boolean;

  @OneToMany(() => Project, (project) => project.developer)
  projects!: Project[];
}
