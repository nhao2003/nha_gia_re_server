import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import IProject from '../interfaces/IProject';
import { PostgresDataType } from '../constants/database_constants';

@Entity('projects')
export class Project extends BaseEntity implements IProject {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column({ type: PostgresDataType.uuid, nullable: true })
  developer_id!: string;

  @Column({ type: PostgresDataType.varchar, length: 255 })
  project_name!: string;

  @Column({ type: PostgresDataType.double_precision, nullable: true })
  total_area!: number;

  @Column({ type: PostgresDataType.date, nullable: true })
  starting_date!: Date;

  @Column({ type: PostgresDataType.date, nullable: true })
  completion_date!: Date;

  @Column({ type: PostgresDataType.date, nullable: true })
  address: any;

  @Column({ type: PostgresDataType.point, nullable: true })
  address_point: any;

  @Column({ type: PostgresDataType.varchar, length: 50, nullable: true })
  progression!: string;

  @Column({ type: PostgresDataType.varchar, length: 50, nullable: true })
  status!: string;

  @Column({ type: PostgresDataType.text, array: true, nullable: true })
  images!: string[];

  @Column({ type: PostgresDataType.boolean, default: false, nullable: true })
  verified!: boolean;

  @Column({ type: PostgresDataType.boolean, default: true })
  is_active!: boolean;
}
