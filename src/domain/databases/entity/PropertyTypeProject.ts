import { Entity, BaseEntity, Column } from 'typeorm';
import { IPropertyType } from '../interfaces/IPropertyType';
import { PostgresDataType } from '../constants/database_constants';
import { PrimaryColumn } from 'typeorm';
import IPropertyTypeProject from '../interfaces/IPropertyTypeProject';
import { OneToOne } from 'typeorm';
import { Project } from './Project';
import { ManyToOne } from 'typeorm';
import { JoinColumn } from 'typeorm';

@Entity('property_types_projects')
class PropertyTypeProject extends BaseEntity implements IPropertyTypeProject {
  @PrimaryColumn({ type: PostgresDataType.uuid })
  projects_id!: string;

  @PrimaryColumn({ type: PostgresDataType.varchar, length: 50 })
  property_types_id!: string;

  @ManyToOne(() => Project, (project) => project.property_types)
  @JoinColumn({ name: 'projects_id' })
  project!: Project;
}
export default PropertyTypeProject;
