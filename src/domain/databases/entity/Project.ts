import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import IProject from '../interfaces/IProject';
import { PostgresDataType } from '../constants/database_constants';
import Address from '~/domain/typing/address';
import { ManyToOne } from 'typeorm';
import { Developer } from './Developer';
import { JoinColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import PropertyTypeProject from './PropertyTypeProject';
import ProjectScale from './ProjectScale';
import { Progression as ProjectProgression, ProjectStatus } from '~/constants/enum';

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
  address!: Address;

  @Column({ type: PostgresDataType.point, nullable: true })
  address_point: any;

  @Column({ type: PostgresDataType.varchar, length: 50, nullable: true })
  progression!: ProjectProgression;

  @Column({ type: PostgresDataType.varchar, length: 50, nullable: true })
  status!: ProjectStatus;

  @Column({ type: PostgresDataType.text, array: true, nullable: true })
  images!: string[];

  @Column({ type: PostgresDataType.boolean, default: false, nullable: true })
  verified!: boolean;

  @Column({ type: PostgresDataType.boolean, default: true })
  is_active!: boolean;

  @ManyToOne(() => Developer, (developer) => developer.projects)
  @JoinColumn({ name: 'developer_id' })
  developer!: Developer;

  @OneToMany(() => PropertyTypeProject, (propertyTypeProject) => propertyTypeProject.project)
  @JoinColumn({ name: 'id' })
  property_types!: PropertyTypeProject[];

  @OneToMany(() => ProjectScale, (projectScale) => projectScale.project)
  @JoinColumn({ name: 'id'})
  scales!: ProjectScale[];
  
}
