import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import IProjectScale from '../interfaces/IProjectScale';
import { PostgresDataType } from '../constants/database_constants';
import { ManyToOne } from 'typeorm';
import { Project } from './Project';
import { JoinColumn } from 'typeorm';

@Entity('project_scales')
class ProjectScale extends BaseEntity implements IProjectScale {
  @PrimaryGeneratedColumn(PostgresDataType.uuid)
  id!: string;

  @Column({ type: PostgresDataType.varchar, length: 50 })
  unit_id!: string;

  @Column({ type: PostgresDataType.uuid })
  project_id!: string;

  @Column({ type: PostgresDataType.integer })
  scale!: number;

  @ManyToOne(() => Project, (project) => project.scales)
  @JoinColumn({ name: 'project_id' })
  project!: Project;
}

export default ProjectScale;
