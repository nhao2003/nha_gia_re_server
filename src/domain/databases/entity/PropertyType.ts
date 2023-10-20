import { BaseEntity, Column } from 'typeorm';
import { IPropertyType } from '../interfaces/IPropertyType';
import { PrimaryColumn } from 'typeorm';
import { PostgresDataType } from '../constants/database_constants';
import { Entity } from 'typeorm';

@Entity('property_types')
export class PropertyType extends BaseEntity implements IPropertyType {
  @PrimaryColumn({ type: PostgresDataType.varchar, length: 255 })
  id!: string;

  @Column({ type: PostgresDataType.varchar, length: 255 })
  name!: string;

  @Column(PostgresDataType.boolean, { default: true })
  is_active!: boolean;
}
